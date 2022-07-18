import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Joiner } from './domain/Joiner';
import { Item } from './domain/Item';
import { Liker } from './domain/Liker';
import { User } from './domain/User';
import { ManageModule } from './manage.module';
import { LoggerMiddleware } from './utils/logger.middleware';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'mcw3',
    entities: [User, Item, Liker, Joiner],
    synchronize: true,
  }),
     ManageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure( consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
