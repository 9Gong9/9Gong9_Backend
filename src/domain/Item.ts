import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
import { Url } from 'url';
@Entity()

@Unique(['id'])
export class Item extends BaseEntity{
  // @PrimaryGeneratedColumn('increment')
  // @PrimaryGeneratedColumn('uuid')
  // @PrimaryGeneratedColumn()
  // id: number;
  // @Column()
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
}