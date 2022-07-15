import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Group } from './Group';
import { UserBuyRecord } from './map/UserBuyRecord';
import { Like } from './map/Like';
@Entity()

@Unique(['id'])
export class User extends BaseEntity{
  //  Basic Account Info
  @PrimaryColumn()
  id: string;
  @Column({nullable:true})
  password: string;
  @Column({ nullable:true })
  isActive: boolean;

  //  Personal Info
  @Column({nullable:true})
  name: string;
  // @Column({ nullable:true })
  // imgUrl: string;
  @Column({ nullable:true })
  budget: number;

  //  One To Many References
  @OneToMany(type=>Like, like => like.user, {
    onDelete:'CASCADE',
    eager: true
  })
  likes: Like[];
  @OneToMany(type=>UserBuyRecord, userBuyRecord => userBuyRecord.user, {
    onDelete:'CASCADE',
    eager: true
  })
  userBuyRecord: UserBuyRecord[];
  @OneToMany(type=>Group, group => group.user, {
    onDelete:'CASCADE',
    eager: true
  })
  groups: Group[];
}