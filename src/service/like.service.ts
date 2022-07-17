import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/User';
import { Connection, Repository } from 'typeorm/index';
import { Item } from '../domain/Item';
import { Joiner } from 'src/domain/Joiner';
import { Like } from 'src/domain/Like';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Joiner) private joinerRepository: Repository<Joiner>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    // private connection: Connection
  ) {
    // this.connection = connection;
    this.itemRepository = itemRepository;
    this.joinerRepository = joinerRepository;
    this.likeRepository = likeRepository;
  }
  /**
   * User 리스트 조회
   */
   async findAll(): Promise<Like[]> {
    return this.likeRepository.find();
  }
  /**
   * 특정 유저 조회
   * @param id
   */
  async findOne(id: number): Promise<Like> {
    return this.likeRepository.findOne({ where:{
      id: id
    } });
  }

  //  유저가 속한 그룹들을 가져옴
  async findWithUserCondition(userId: string): Promise<Like[]> {
    return await this.likeRepository.find(
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
  
  async findWithUserItemCondition(userId: string, itemId: number): Promise<Like>{
    return await this.likeRepository.findOne(
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
  async saveLike(Like : Like): Promise<void> {
    await this.likeRepository.save(Like);
  }
  /**
   * 유저 삭제
   */
  async deleteLike(id: number): Promise<void> {
    await this.likeRepository.delete({ id: id });
  }

}

