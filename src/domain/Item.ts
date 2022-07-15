import { group } from 'console';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Url } from 'url';
import { Group } from './Group';
import { UserBuyRecord } from './map/UserBuyRecord';
import { Like } from './map/Like';
@Entity()

@Unique(['id'])
export class Item extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  name: string;
  @Column({type: 'decimal', precision: 2, scale: 1, nullable:true})
  rate: number;
  @Column({ nullable:true })
  orgPrice: number;
  @Column({ nullable:true })
  salePrice: number;
  @Column({ nullable:true })
  minMan: number;
  @Column({ nullable:true })
  nowMan: number;
  @Column({ nullable:true })
  dueDate: Date;
  @Column({ nullable:true })
  imgUrl: string;
  @Column({ nullable:true })
  state: string;
  @Column({ nullable:true })
  area: string;
  @Column({ nullable:true })
  town: string;

  //   One To Many References
  @OneToMany(type=>Like, like => like.item, {
    onDelete:'CASCADE',
    eager: true
  })
  likes: Like[];
  @OneToMany(type=>UserBuyRecord, userBuyRecord => userBuyRecord.item, {
    onDelete:'CASCADE',
    eager: true
  })
  userBuyRecord: UserBuyRecord[];
  @OneToMany(type=>Group, group => group.item, {
    onDelete:'CASCADE',
    eager: true
  })
  groups: Group[];
}