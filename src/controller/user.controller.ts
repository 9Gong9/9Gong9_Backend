import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
// import { TestService } from '../test/test.service';
import { User } from '../domain/User';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {
    this.userService = userService;
  }
  // @Get('test')
  // findAnotherTest(): string {
  //   return this.testService.getInfo();
  // }


  @Get('list')  //  모든 유저의 목록 조회
  async findAll(): Promise<User[]> {
    const userList = await this.userService.findAll();
    console.log(userList);
    return Object.assign({
      data: userList,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  @Post() //  유저 회원가입
  async saveUser(@Body() body): Promise<string> {
    console.log("request recieved");
    // validateToken(user.userId, user.token);

    if(await this.userService.findOne(body.id)){
      return Object.assign({
        data: { /* id: this.userKey,  */
          ...body },
        statusCode: 401,
        statusMsg: `이미 있는 회원입니다!`,
      });
    }

    const user = new User();
    user.id = body.id;
    user.name = body.name;
    user.password = body.password;
    user.isActive = false;
    await this.userService.saveUser(user);

    return Object.assign({
      data: { /* id: this.userKey,  */
        ...user },
      statusCode: 201,
      statusMsg: `회원가입이 성공적으로 완료되었습니다.`,
    });
  }
  
  @Put()// 로그인작업
  async loginUser(@Body() body): Promise<string> {
    // validateToken(user.userId, user.token);
    // await this.userService.saveUser({ /* id: this.generateUserId(), */ ...user});
    const user = await this.userService.findOne(body.id);
    if(!(user)){
      return Object.assign({
        data: { /* id: this.userKey,  */
          ...body },
        statusCode: 401,
        statusMsg: `존재하지 않는 회원입니다!`,
      });
    }
    if((user.password !== body.password)){
      return Object.assign({
        data: { /* id: this.userKey,  */
          ...body },
        statusCode: 401,
        statusMsg: `올바르지 않은 비밀번호입니다!`,
      });
    }

    user.isActive = true;

    await this.userService.saveUser(user);
    return Object.assign({
      data: { /* id: this.userKey,  */
        ...user },
      statusCode: 201,
      statusMsg: `로그인 성공`,
    });
  }


  @Put(':userId/logout')  // 로그아웃
  async logout(@Param('userId') userId: string, @Body() body): Promise<string>{
    const user = await this.userService.findOne(userId);
    if(!user){ return Object.assign({
      data: {
        userId,
      },
      statusCode: 404,
      statusMsg: '존재하지 않는 회원입니다.',
    })
    }
    user.isActive = false;
    await this.userService.saveUser(user);

    return Object.assign({
      data: {
        userId,
      },
      statusCode: 204,
      statusMsg: '로그아웃이 성공적으로 완료되었습니다.',
    })
  }

  @Get(':userId') //회원정보 조회
  async findOne(@Param('userId') id: string, @Body() body): Promise<User> {
    const foundUser = await this.userService.findOne(id);
    if(foundUser){
      return Object.assign({
        data: foundUser,
        statusCode: 400,
        statusMsg: `존재하지 않는 유저입니다.`,
      });
    }
    return Object.assign({
      data: foundUser,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }

  

  @Delete(':userId')  //회원 탈퇴
  async deleteUser(@Param('userId') id: string, @Body() body): Promise<string> {

    const deleteuser = await this.userService.findOne(id);    
    if(!deleteuser){ 
      return Object.assign({
      data: { userId: id },
      statusCode: 400,
      statusMsg: `존재하지 않는 회원입니다.`,
    });

    }
    const user = await this.userService.deleteUser(id);
    return Object.assign({
      data: { userId: id },
      statusCode: 201,
      statusMsg: `유저 정보가 성공적으로 삭제되었습니다.`,
    });
  }
}


// import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
// import { UserDto } from './dto/user.dto';
// import { UserService } from './user.service';

// @Controller('user')
// export class UserController {
//   // @Get(':userId')
//   // findOne(@Param('userId') id: string): string {
//   //   return Object.assign({ id, userName: '이정주' });
//   // }

//   //Dependency Injection
//   constructor(private userService: UserService) {
//     this.userService = userService;
//   }



//   // @Get('list')
//   // findAll(): Promise<any[]> {
//   //   return new Promise((resolve) =>
//   //     setTimeout(
//   //       () => resolve([{ userName: '이정주' }, { userName: '김명일' }]),
//   //       100,
//   //     ),
//   //   );
//   // }

//   // @Get(':userId')
//   // findOne(@Param('userId') id: string, @Res() res): string {
//   //   // return res.status(200).send({ id, userName: '이정주', accountNum: 123 });
//   //   return res.status(200).send({ id, userName: '이정주', accountNum: 123 });
//   // }

//   // @Post()
//   // saveUser(@Body() payload): string {
//   //   return Object.assign({
//   //     statusCode: 201,
//   //     data: payload,
//   //     statusMsg: 'created successfully',
//   //   });
//   // }

//   // @Post()
//   // saveUser(@Body() userDto: UserDto): string {
//   //   return Object.assign({
//   //     data: { ...userDto },
//   //     statusCode: 201,
//   //     statusMsg: `saved successfully`,
//   //   });
//   // }

//   @Get('list')
//   findAll(): Promise<UserDto[]> {
//     return this.userService.findAll();
//   }
//   @Get(':userId')
//   findOne(@Param('userId') id: string): any | object {
//     return this.userService.findOne(id);
//   }
//   @Post()
//   saveUser(@Body() userDto: UserDto): string {
//     this.userService.saveUser(userDto);
//     return Object.assign({
//       data: { ...userDto },
//       statusCode: 201,
//       statusMsg: `saved successfully`,
//     });
//   }


// }
