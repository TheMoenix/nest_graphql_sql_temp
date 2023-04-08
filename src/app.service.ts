import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthcheck(): string {
    return `${process.env.MOENIX_DEPLOYMENT_NAME} is healthy`;
  }
}
