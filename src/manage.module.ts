import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/User';
import { Item } from './domain/Item';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';
import { Liker } from './domain/Liker';
import { Joiner } from './domain/Joiner';
import { JoinerService } from './service/Joiner.service';
import { LikerService } from './service/liker.service';
// import { SpendController } from './controller/spend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Item, Liker, Joiner])],
  controllers: [UserController, ItemController],
  providers: [UserService, ItemService, JoinerService, LikerService],
})
export class ManageModule {}