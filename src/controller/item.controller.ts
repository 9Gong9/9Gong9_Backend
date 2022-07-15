import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
// import { TestService } from '../test/test.service';
import { User } from '../domain/User';
import { ItemService } from 'src/service/item.service';
import { Item } from 'src/domain/Item';
@Controller('item')
export class ItemController {
  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {
    this.userService = userService;
    this.itemService = itemService;
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
    'Daejeon','Daegu','Seoul','Gwangju','Busan','Ulsan','Incheon','Suwon','Jeju','Dokdo'
  ]
  areas = [
    'area1','area2','area3','area4','area5','area6'
  ]
  towns=[
    'town1','town2','town3','town4','town5','town6'
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