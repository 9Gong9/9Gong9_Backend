import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Item } from './domain/Item';
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
    entities: [User, Item],
    synchronize: true,
  }),
     ManageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
