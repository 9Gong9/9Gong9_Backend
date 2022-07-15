import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm/index';
@Entity()

@Unique(['id'])
export class User extends BaseEntity{
  // @PrimaryGeneratedColumn('increment')
  // @PrimaryGeneratedColumn('uuid')
  // @PrimaryGeneratedColumn()
  // id: number;
  // @Column()
  @PrimaryColumn()
  id: string;
  @Column({nullable:true})
  name: string;
  @Column({nullable:true})
  password: string;
  @Column({ nullable:true })
  isActive: boolean;
}