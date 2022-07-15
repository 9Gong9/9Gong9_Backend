import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Group } from './domain/Group';
import { Item } from './domain/Item';
import { UserBuyRecord } from './domain/map/UserBuyRecord';
import { Like } from './domain/map/Like';
import { User } from './domain/User';
import { ManageModule } from './manage.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'mcw3',
    entities: [User, Item, Like, UserBuyRecord, Group],
    synchronize: true,
  }),
     ManageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
