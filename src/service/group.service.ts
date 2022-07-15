import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
import { Group } from 'src/domain/Group';

@Injectable()
export class GroupService {
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
   async findAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Group> {
    return this.groupRepository.findOne({ where:{
      id: id
    } });
  }

  //  유저가 속한 그룹들을 가져옴
  async findWithUserCondition(userId: string): Promise<Group[]> {
    return await this.groupRepository.find(
      {
        loadRelationIds: {
          relations: [
            'user',
            'item'
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId}
        }
      }
    )
  }
  
  async findWithUserItemCondition(userId: string, itemId: number): Promise<Group>{
    return await this.groupRepository.findOne(
      {
        loadRelationIds: {
          relations: [
            'user',
            'item'
          ],
          disableMixedMap: true
        },
        where: {
          user : {id: userId},
          item: {id: itemId}
        }
      }
    )
  }

  /**
   * 유저 저장
   * @param user
   */
  async saveGroup(group : Group): Promise<void> {
    await this.groupRepository.save(group);
  }
  /**
   * 유저 삭제
   */
  async deleteGroup(id: number): Promise<void> {
    await this.groupRepository.delete({ id: id });
  }

}

