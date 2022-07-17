import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/User';
import { Item } from './domain/Item';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';
import { Like } from './domain/Like';
import { Joiner } from './domain/Joiner';
import { JoinerService } from './service/Joiner.service';
import { LikeService } from './service/like.service';
// import { SpendController } from './controller/spend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Item, Like, Joiner])],
  controllers: [UserController, ItemController],
  providers: [UserService, ItemService, JoinerService, LikeService],
})
export class ManageModule {}