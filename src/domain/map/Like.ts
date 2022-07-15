import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Item } from '../Item';
import { User } from '../User';
@Entity()

@Unique(['id'])
export class Like extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  //   Many To One References
  @ManyToOne(type => User, user => user.likes)
  @JoinColumn({name: 'ref_userId'})
  user: User;
  @ManyToOne(type => Item, item => item.likes)
  @JoinColumn({name: 'ref_itemId'})
  item: Item;
}