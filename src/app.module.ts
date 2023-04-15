import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLMiddleware } from './middlewares/graphql.middleware';
import { ApolloDriver } from '@nestjs/apollo';
import { QueryResolver } from './resolvers/query.resolver';
import { MutationResolver } from './resolvers/mutation.resolver';
import { AuthService } from './services/auth.service';
import { CommonService } from './services/commonService';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { Session } from './models/session.model';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'example',
      database: 'moenix',
      entities: [User, Session],
      synchronize: true,
      retryAttempts: 3,
    }),
    TypeOrmModule.forFeature([User, Session]),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: true,
      autoSchemaFile: true,
      sortSchema: true,
      installSubscriptionHandlers: true,
      context: GraphQLMiddleware,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CommonService,
    SessionService,
    UserService,
    AuthService,
    Logger,
    QueryResolver,
    MutationResolver,
  ],
})
export class AppModule {}
