import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
// import { TestService } from '../test/test.service';
import { User } from '../domain/User';
import { ItemService } from 'src/service/item.service';
import { Item } from 'src/domain/Item';
import { group } from 'console';
import { GroupService } from 'src/service/group.service';
import { LikeService } from 'src/service/like.service';
import { Like } from 'src/domain/map/Like';
import { Group } from 'src/domain/Group';
@Controller('item')
export class ItemController {
  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private groupService: GroupService,
    private likeService: LikeService
  ) {
    this.userService = userService;
    this.itemService = itemService;
    this.groupService = groupService;
    this.likeService = likeService;
  }
  

  // primaryDataGenerator();
  async primaryDataGenerator(){
    for(let i=0;i<10;i++){
      for(let j=0;j<10;j++){
        const item = new Item();
        item.name = `${i} + ${j}`;
        item.rate = i;
        item.orgPrice = 1000;
        item.salePrice = 500;
        item.state = "대전광역시";
        item.area = "유성구";
        item.town = "궁동";
        await this.itemService.saveItem(item);
      }
    }
  }

  states = [
    '대전광역시','대구광역시','서울턱별시','광주광역시','Busan','Ulsan','Incheon','Suwon','Jeju','Dokdo'
  ]
  areas = [
    '도봉구','영통구','유성구','area4','area5','area6', '가라충!'
  ]
  towns=[
    '신성동','장동','강호동','town4','town5','town6'
  ]
  @Get('primaryAction')
  async primaryAction(){
    for(let i=0;i<this.states.length;i++){
      for(let j=0;j<this.areas.length;j++){
        for(let k=0;k<this.towns.length;k++){
          const item = new Item();
          item.name = `${i} + ${j} + ${k}`;
          item.rate = i;
          item.orgPrice = 1000;
          item.salePrice = 500;
          item.state = this.states[i];
          item.area = this.areas[j];
          item.town = this.towns[k];
          await this.itemService.saveItem(item);
        }
        }
    }
  }

  @Get('list')  //전체상품목록조회
  async findAll(): Promise<Item[]> {
    console.log('get item list');
    const itemList = await this.itemService.findAll();
    console.log(itemList);
    return Object.assign({
      data: itemList,
      statusCode: 200,
      statusMsg: `상품 목록 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Get('/list/:state/:area/:town')
  async findOne(@Param() param, @Body() body): Promise<Item[]> {
    const {state, area, town} = param;
    const foundItemList = await this.itemService.findWithRegionCondition(state, area, town);
    console.log(state, area, town);
    if(!foundItemList){
      return Object.assign({
        data: foundItemList,
        statusCode: 400,
        statusMsg: '해당 지역에 상품이 없습니다.',
      });
    }
    return Object.assign({
      data: foundItemList,
      statusCode: 200,
      statusMsg: `상품 조회가 완료되었습니다.`,
    });
  }

  @Get('/list/:userId/ongoing') //  현재 유저가 참여중인 ongoing 상품을 조회
  async findUsersOngoingItems(@Param('userId') userId: string):Promise<Item[]>{
    const usersOngoingGroup = await this.groupService.findWithUserCondition(userId);
    const returnData = [];
    const nowDate = new Date();
    for(let i = 0; i <usersOngoingGroup.length;i++){
      const candidateItem = usersOngoingGroup[i].item;
      if(candidateItem.dueDate > nowDate){
        returnData.push(candidateItem);
      }
    }
    return Object.assign({
      data: { usersOngoingItems:returnData },
      statusCode: 201,
      statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
    });
  }

  
  @Get('/list/:userId/previous') //  유저가 참여했던던 상품목록을 조회
  async findUsersPreviousItems(@Param('userId') userId: string):Promise<Item[]>{
    const usersPrevGroup = await this.groupService.findWithUserCondition(userId);
    const returnData = [];
    const nowDate = new Date();
    for(let i = 0; i <usersPrevGroup.length;i++){
      const candidateItem = usersPrevGroup[i].item;
      if(candidateItem.dueDate < nowDate){
        returnData.push(candidateItem);
      }
    }
    return Object.assign({
      data: { usersPreviousItems:returnData },
      statusCode: 201,
      statusMsg: `유저의 과거참여 목록이 성공적으로 조회되었습니다.`,
    });
  }

  @Get('/list/:userId/likes') //  유저가 관심있는 목록을 조회
  async findLikedItems(@Param('userId') userId: string):Promise<Item[]>{
    const usersLikedGroup = await this.groupService.findWithUserCondition(userId);
    const returnData = [];
    const nowDate = new Date();
    for(let i = 0; i <usersLikedGroup.length;i++){
      const candidateItem = usersLikedGroup[i].item;
      if(candidateItem.dueDate > nowDate){
        returnData.push(candidateItem);
      }
    }
    return Object.assign({
      data: { usersLikedItem:returnData },
      statusCode: 201,
      statusMsg: `유저의 참여 목록이 성공적으로 조회되었습니다.`,
    });
  }

  @Put('/like/:userId/:itemId') //  유저가 상품에 누른 좋아요의 toggle
  async toggleUsersLikeItem(@Param() param):Promise<void>{
    const userId = param.userId;
    const itemId = param.itemId;
    let nowLiked :boolean;
    const ifAlreadyLiked = await this.likeService.findWithUserItemCondition(userId, itemId);
    if(ifAlreadyLiked == null){
      const newLike = new Like();
      newLike.user = await this.userService.findOne(userId);
      newLike.item = await this.itemService.findOne(itemId);
      nowLiked = true;
    }else{
      await this.likeService.deleteLike(ifAlreadyLiked.id);
      nowLiked = false;
    }
    return Object.assign({
      data: { userId,
        itemId,
        nowLiked  },
      statusCode: 201,
      statusMsg: `유저의 관심여부 변경이 성공적으로 반영되었습니다.`,
    });
  }

  @Put('/join/:userId/:itemId') //  유저가 상품에 누른 좋아요의 toggle
  async toggleUsersJoinItem(@Param() param):Promise<void>{
    const userId = param.userId;
    const itemId = param.itemId;
    let nowJoined :boolean;
    const ifAlreadyJoined = await this.groupService.findWithUserItemCondition(userId, itemId);
    if(ifAlreadyJoined == null){
      const newJoin = new Group();
      newJoin.user = await this.userService.findOne(userId);
      newJoin.item = await this.itemService.findOne(itemId);
      nowJoined = true;
    }else{
      await this.groupService.deleteGroup(ifAlreadyJoined.id);
      nowJoined = false;
    }
    return Object.assign({
      data: { userId,
        itemId,
        nowJoined  },
      statusCode: 201,
      statusMsg: `유저의 참여여부 변경이 성공적으로 반영되었습니다.`,
    });
  }



  @Delete(':userId')
  async deleteUser(@Param('userId') id: string, @Body() body): Promise<string> {

    const deleteuser = await this.userService.findOne(id);    
    if(!deleteuser){ 
      return Object.assign({
      data: { userId: id },
      statusCode: 400,
      statusMsg: `존재하지 않는 회원입니다.`,
    });

    }
    const user = await this.userService.deleteUser(id);
    return Object.assign({
      data: { userId: id },
      statusCode: 201,
      statusMsg: `유저 정보가 성공적으로 삭제되었습니다.`,
    });
  }
}