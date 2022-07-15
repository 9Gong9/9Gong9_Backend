import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/User';
import { Item } from './domain/Item';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';
import { Like } from './domain/map/Like';
import { UserBuyRecord } from './domain/map/UserBuyRecord';
import { Group } from './domain/Group';
import { GroupService } from './service/group.service';
// import { SpendController } from './controller/spend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Item, Like, UserBuyRecord, Group])],
  controllers: [UserController, ItemController],
  providers: [UserService, ItemService, GroupService],
})
export class ManageModule {}