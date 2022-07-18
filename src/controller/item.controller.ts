import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../domain/User';
import { ItemService } from 'src/service/item.service';
import { Item } from 'src/domain/Item';
import { JoinerService } from 'src/service/Joiner.service';
import { LikeService } from 'src/service/like.service';
import { Like } from 'src/domain/Like';
import { Joiner } from 'src/domain/Joiner';
import { getItemData, getRegionData } from 'src/utils/dataImporter';
import { itemFormat, itemFormatWithUserJoinLike, itemListFilterWithSearchWord, itemListFormat, itemListFormatWithUsersJoinLike } from 'src/utils/dataFormater';
@Controller('item')
export class ItemController {
  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private joinerService: JoinerService,
    private likeService: LikeService
  ) {
    this.userService = userService;
    this.itemService = itemService;
    this.joinerService = joinerService;
    this.likeService = likeService;
  } 

  @Get('regionList')  //  대전광역시의 시군구 정보를 불러온다. 런칭된 앱에서는 쓸 일 없음
  async returnRegionList():Promise<void>{
    const regionData = getRegionData();
    return Object.assign({
      data: regionData,
      statusCode:200,
      statusMsg: '동네 정보가 성공적으로 조회되었습니다.'
    });
  }

  @Get('itemCrawl') //  대전광역시의 시군구 정보를 불러온 뒤, (위의 리퀘스트 추가실행 필요X) 더미 상품을들 '동'단위 별로 '카테고리'별로 25개씩 담는다. 런칭된 앱에서는 쓸 일 없음
  async itemCrawlFetch():Promise<void>{
    const regionList = getRegionData();
    const siteList = [
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095739","과일"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095740","채소"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095498","쌀/잡곡/견과"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095499","정육/계란류"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095500","수산물/건해산"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095501","우유/유제품/유아식"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095502","냉장/냉동/간편식"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095507","생수/음료/주류"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095503","밀키트/김치/반찬"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095508","커피/원두/차"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095504","라면/면류/즉석식품/통조림"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095509","장류/양념/가루/오일"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095505","과자/시리얼/빙과/떡"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095506","베이커리/잼/샐러드"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095510","건강식품"],
      // ["https://emart.ssg.com/category/main.ssg?dispCtgId=6000095511","친환경/유기농"],
    ];
    siteList.forEach(async (e)=>{
      const url = e[0];
      const category = e[1];
      const data = await getItemData(url);
      for(let state in regionList){
        for(let area in regionList[state]){
          for(let town in regionList[state][area]){
            data.forEach(async (e)=>{
              const item: Item = new Item();
              const nowDate = new Date();
              item.name = e.name;
              item.rate = e.rate;
              item.orgPrice = e.orgPrice;
              item.salePrice = e.salePrice;
              item.minMan = Math.floor(Math.random()*10);
              item.nowMan = 0;
              nowDate.setDate(nowDate.getDate() + Math.floor(Math.random()*10));
              nowDate.setHours(0,0,0,0);  //  we don't need hh:mm:ss:msms info in this app
              item.dueDate = nowDate;
              item.imgUrl = e.imgUrl;
              item.category = category;
              item.state = state;
              item.area = area;
              item.town = regionList[state][area][town];
              await this.itemService.saveItem(item);
            })
          }
        }
      }
      console.log("Done!");
      await setTimeout(()=>{return}, 10000);
    })
  }

  @Get('list')  ////  지역고려X 모든 상품 내역을 불러온다. 런칭된 앱에서는 쓸 일 없음
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

  @Get('test')
  async testFunc():Promise<void>{
    const usersOngoingGroup = await this.joinerService.findWithUserCondition("jina0202"); 
  }

  
  /* 여기서부터 메인  비즈니스 로직. 위에는 앱에서 보낼 일이 없는 Req 이다. */


  @Get('list/:state/:area/:town')  //  선택된 지역의 모든 상품 조회, 상품명 리스트와 함께 반환
  async findOne(@Param() param, @Body() body, @Query() query): Promise<Item[]> {
    const {state, area, town} = param;
    const userId = body.userId;
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const foundItemList = await this.itemService.findWithRegionCondition(state, area, town);
    console.log(state, area, town);
    if(!foundItemList){
      return Object.assign({
        data: foundItemList,
        statusCode: 400,
        statusMsg: '해당 지역에 상품이 없습니다.',
      });
    }

    const usersJoinedGroup = await this.joinerService.findWithUserCondition(userId); 
    const usersLikedGroup = await this.likeService.findWithUserCondition(userId);
    let resultItemList = itemListFormatWithUsersJoinLike(foundItemList, usersJoinedGroup, usersLikedGroup);
    if(query.searchWord != null){
      resultItemList = itemListFilterWithSearchWord(resultItemList, query.searchWord);
    }

    let foundNameList : string[] = [];  //  검색어자동완성 기능을 위한 NAME LIST 동봉 반환
    foundItemList.forEach(element => {
      foundNameList.push(element.name);
    });

    return Object.assign({
      data: {
        foundNameList,
        resultItemList
      },
      statusCode: 200,
      statusMsg: `상품 조회가 완료되었습니다.`,
    });
  }

  @Get('list/:state/:area/:town/:category')  //  선택된 지역의 특정 품목 모든 상품 조회, 상품명 리스트와 함께 반환
  async findWithRegionCategory(@Param() param, @Body() body, @Query() query): Promise<Item[]> {
    const {state, area, town, category} = param;
    const userId = body.userId;
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const foundItemList = await this.itemService.findWithRegionCategoryCondition(state, area, town, category);
    console.log(state, area, town, category);
    if(!foundItemList){
      return Object.assign({
        data: foundItemList,
        statusCode: 400,
        statusMsg: '해당 지역 또는 품목에 상품이 없습니다.',
      });
    }

    const usersJoinedGroup = await this.joinerService.findWithUserCondition(userId); 
    const usersLikedGroup = await this.likeService.findWithUserCondition(userId);
    let resultItemList = itemListFormatWithUsersJoinLike(foundItemList, usersJoinedGroup, usersLikedGroup);
    if(query.searchWord != null){
      resultItemList = itemListFilterWithSearchWord(resultItemList, query.searchWord);
    }

    let foundNameList : string[] = [];  //  검색어자동완성 기능을 위한 NAME LIST 동봉 반환
    foundItemList.forEach(element => {
      foundNameList.push(element.name);
    });

    return Object.assign({
      data: {
        foundNameList,
        resultItemList
      },
      statusCode: 200,
      statusMsg: `상품 조회가 완료되었습니다.`,
    });
  }

  @Get('/list/:userId/ongoing') //  현재 유저가 참여중인 ongoing 상품을 조회
  async findUsersOngoingItems(@Param('userId') userId: string):Promise<Item[]>{
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersOngoingGroup = await this.joinerService.findWithUserCondition(userId); //  유저가 참여한 적 있는 상품 목록 가져오기
    const nowDate = new Date();
    nowDate.setHours(0,0,0,0);
    const usersOngoingItemList = [];
    for(let e of usersOngoingGroup){    //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
      const candidateItem = await this.itemService.findOne(e.item.id);
      if(candidateItem.dueDate >= nowDate){
        usersOngoingItemList.push(candidateItem);
      }
    }
    // usersOngoingGroup.forEach(async (e)=>{    //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   if(candidateItem.dueDate >= nowDate){
    //     usersOngoingItemList.push(candidateItem);
    //   }
    // });
    const resultItemList = itemListFormat(usersOngoingItemList);
    return Object.assign({
      data: { usersOngoingItems:resultItemList },
      statusCode: 200,
      statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
    });
  }

  
  @Get('/list/:userId/previous') //  유저가 참여했던 상품목록을 조회
  async findUsersPreviousItems(@Param('userId') userId: string):Promise<Item[]>{
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersPrevGroup = await this.joinerService.findWithUserCondition(userId);  //  유저가 참여한 적 있는 상품 목록 가져오기
    console.log(usersPrevGroup);
    const nowDate = new Date();
    nowDate.setHours(0,0,0,0);
    const usersPrevItemList = [];
    for (let e of usersPrevGroup){   //  날짜를 비교하여 마감이 이미 된 상품만 필터링
      const candidateItem = await this.itemService.findOne(e.item.id);
      console.log("dueDate");
      console.log(candidateItem.dueDate);
      if(candidateItem.dueDate < nowDate){
        console.log(candidateItem);
        usersPrevItemList.push(candidateItem);
      }
    }
    // usersPrevGroup.forEach(async (e)=>{   //  날짜를 비교하여 마감이 이미 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   console.log("dueDate");
    //   console.log(candidateItem.dueDate);
    //   if(candidateItem.dueDate < nowDate){
    //     console.log(candidateItem);
    //     usersPrevItemList.push(candidateItem);
    //   }
    // })
    const resultItemList = itemListFormat(usersPrevItemList);
    const response =  Object.assign({
      data: resultItemList,
      statusCode: 200,
      statusMsg: `유저의 과거참여 목록이 성공적으로 조회되었습니다.`,
    });
    console.log("RESPONSE : ");
    console.log(response);
    return response;
  }

  @Get('/list/:userId/likes') //  유저가 관심있는 목록을 조회
  async findLikedItems(@Param('userId') userId: string):Promise<Item[]>{
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    const usersLikedGroup : Like[]= await this.likeService.findWithUserCondition(userId);
    const nowDate = new Date();
    nowDate.setHours(0,0,0,0);
    const usersLikedItemList = [];
    for(let e of usersLikedGroup){  //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
      const candidateItem = await this.itemService.findOne(e.item.id);
      if(candidateItem.dueDate >= nowDate){
        usersLikedItemList.push(candidateItem);
      }

    }
    // usersLikedGroup.forEach(async (e)=>{  //  날짜를 비교하여 마감이 아직 안 된 상품만 필터링
    //   const candidateItem = await this.itemService.findOne(e.item.id);
    //   if(candidateItem.dueDate >= nowDate){
    //     usersLikedItemList.push(candidateItem);
    //   }
    // });
    const resultItemList = itemListFormat(usersLikedItemList);
    return Object.assign({
      data: { usersLikedItem:resultItemList },
      statusCode: 200,
      statusMsg: `유저의 관심 목록이 성공적으로 조회되었습니다.`,
    });
  }
  
  @Get(':itemId')  ////  특정 ID의 아이템 세부정보 로딩
  async findOneItem(@Param('itemId') itemId: number, @Query() query): Promise<Item> {
    // console.log('get item with id : '+ itemId+' considering user: '+query.userId);
    const userId = query.userId;
    const item = await this.itemService.findOne(itemId);
    // console.log(item);
    const usersJoinedGroup = await this.joinerService.findWithUserCondition(userId); 
    const usersLikedGroup = await this.likeService.findWithUserCondition(userId);
    const response = Object.assign({
      data: { 
        ...itemFormatWithUserJoinLike(item, usersJoinedGroup, usersLikedGroup)
      },
      statusCode: 200,
      statusMsg: `상품 조회가 성공적으로 완료되었습니다.`,
    });
    // console.log(response);

    return response;
  }

  @Put('/like/:userId/:itemId') //  유저가 상품에 누른 좋아요(관심)의 toggle
  async toggleUsersLikeItem(@Param() param):Promise<void>{
    const userId = param.userId;
    const itemId = param.itemId;
    if(await this.userService.findOne(userId) == null){
      return Object.assign({
        data:userId,
        statusCode: 400,
        statusMsg: '해당 ID의 회원은 존재하지 않습니다.'
      })
    }
    let nowLiked :boolean;
    const ifAlreadyLiked = await this.likeService.findWithUserItemCondition(userId, itemId);
    if(ifAlreadyLiked == null){
      console.log("원래는 좋아요 안 돼 있었으므로 좋아요 하겠음!!!");
      console.log(ifAlreadyLiked);
      const newLike = new Like();
      newLike.user = await this.userService.findOne(userId);
      newLike.item = await this.itemService.findOne(itemId);
      await this.likeService.saveLike(newLike);
      nowLiked = true;
    }else{
      console.log("이미 좋아요 있으므로 취소 하겠음!!!");
      console.log(ifAlreadyLiked);
      await this.likeService.deleteLike(ifAlreadyLiked.id);
      nowLiked = false;
    }
    const response = Object.assign({
      data: { userId,
        itemId,
        nowLiked  },
      statusCode: 201,
      statusMsg: `유저의 관심여부 변경이 성공적으로 반영되었습니다.`,
    });
    console.log("RESPONSE :");
    console.log(response);
    return response;
  }

  @Put('/join/:userId/:itemId') //  유저의 상품에 대한 참여여부의 toggle
  async toggleUsersJoinItem(@Param() param):Promise<void>{
    const userId = param.userId;
    const itemId = param.itemId;
    let toggleItem;
    let toggleUser;
    let nowJoined :boolean;
    const ifAlreadyJoined = await this.joinerService.findWithUserItemCondition(userId, itemId);
    if(ifAlreadyJoined == null){
      const newJoin = new Joiner();
      newJoin.user = await this.userService.findOne(userId);
      newJoin.item = await this.itemService.findOne(itemId);
      console.log(`new Join's Item is ${newJoin.item}`);
      console.log(newJoin.item);
      nowJoined = true;
      await this.joinerService.saveJoiner(newJoin);
      console.log(await this.joinerService.findWithUserItemCondition(userId, itemId));
      toggleItem = await this.itemService.findOne(itemId);
      toggleUser = await this.userService.findOne(userId);
      toggleItem.nowMan += 1;
      toggleUser.budget -= toggleItem.salePrice;
      await this.itemService.saveItem(toggleItem);
      await this.userService.saveUser(toggleUser);
    }else{
      await this.joinerService.deleteJoiner(ifAlreadyJoined.id);
      toggleItem = await this.itemService.findOne(itemId);
      toggleUser = await this.userService.findOne(userId);
      nowJoined = false;
      toggleItem.nowMan -= 1;
      toggleUser.budget += toggleItem.salePrice;
      await this.itemService.saveItem(toggleItem);
      await this.userService.saveUser(toggleUser);
    }
    // await this.itemService.saveItem(toggleItem);
    return Object.assign({
      data: { userId,
        itemId,
        nowJoined  },
      statusCode: 201,
      statusMsg: `유저의 참여여부 변경이 성공적으로 반영되었습니다.`,
    });
  }

  //임시로 아이템 추가하는 request
  @Post() //  
  async addItem(@Body() body):Promise<void>{
    const item = new Item();
    item.name = body.name;
    item.rate = body.rate;
    item.orgPrice = body.orgPrice;
    item.salePrice = body.salePrice;
    item.minMan = body.minMan;
    item.nowMan = 0
    const newDate = new Date(body.dueDate);
    newDate.setHours(0,0,0,0);
    item.dueDate = newDate;
    item.imgUrl = body.imgUrl;
    item.category = body.category;
    item.state = body.state;
    item.area = body.area;
    item.town = body.town;
    await this.itemService.saveItem(item);
    return Object.assign({
      data:item,
      statusCode: 201,
      statusMsg: `아이템이 성공적으로 추가되었습니다.`,
    });
  }
}