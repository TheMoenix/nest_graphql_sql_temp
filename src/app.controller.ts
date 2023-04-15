import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from './services/commonService';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  @Get('/healthcheck')
  healthcheck(): string {
    console.log(`${process.env.MOENIX_DEPLOYMENT_NAME} is healthy`);
    return this.appService.getHealthcheck();
  }

  @Get('/session')
  async getUserBySession(
    @Headers('x-session') token: string,
    @Headers('isActivity') isActivity: boolean,
  ) {
    if (isActivity) await this.sessionService.updateLastActivityAt(token);
    return await this.sessionService.getSessionInfo(token);
  }

  @Post('/login')
  async userLogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.userLogin(
      email,
      this.commonService.encrypt(password),
    );
  }

  @Post('/register')
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('username') username: string,
    @Body('name') name: string,
  ) {
    return this.userService.createUser({
      email,
      password: await this.commonService.encrypt(password),
      username,
      name,
    });
  }
}
