import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.itemRepository = itemRepository;
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

