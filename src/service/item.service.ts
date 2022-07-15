import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
import { Group } from 'src/domain/Group';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.itemRepository = itemRepository;
    this.groupRepository = groupRepository;
  }
  /**
   * User 리스트 조회
   */
   async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Item> {
    return this.itemRepository.findOne({ where:{
      id: id
    } });
  }

  //  메인 탭에서 지역을 설정하였을 때 지역에 해당하는 상품들 리스트
  async findWithRegionCondition(state, area, town){
    return await this.itemRepository.find(
      {
        where: {
          state: state,
          area :area,
          town : town
        }
      }
    )
  }

  //  특정 지역에서 아직 현재진행형인 상품들 리스트
  async findWithRegionOngoingCondition(state : string, area : string, town : string){
    const nowDate = new Date();
    return await this.itemRepository
    .createQueryBuilder("item")
    .where("item.dueDate > :Date", {date:nowDate})
    .andWhere("item.state = :state", {state:state})
    .andWhere("item.area = :area", {area:area})
    .andWhere("item.town = :town", {town:town})
    .getMany();
  }

  //  내가 좋아요를 누른 상품들 리스트
  async findWithLikeCondition(user): Promise<Item[]>{
    const usersNowGroup = await this.groupRepository.find({
        loadRelationIds: {
          relations: [
            'user',
            'item'
          ],
          disableMixedMap: true
        },
        where: {
          user: user
        }
    })
    const nowDate = new Date();
    return await this.itemRepository
    .createQueryBuilder("item")
    .where("item.dueDate > :Date", {date:nowDate})
    .getMany();
  }
  /**
   * 유저 저장
   * @param user
   */
  async saveItem(item : Item): Promise<void> {
    await this.itemRepository.save(item);
  }
  /**
   * 유저 삭제
   */
  async deleteItem(id: number): Promise<void> {
    await this.itemRepository.delete({ id: id });
  }


}

