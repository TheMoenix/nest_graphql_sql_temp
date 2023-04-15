import { GqlAuthGuard } from '../guards/graphql.guard';
import { Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/models/user.model';

@UseGuards(new GqlAuthGuard())
export class QueryResolver {
  constructor() {}

  @Query(() => String)
  async get() {
    return 'test';
  }

  @Query(() => User)
  async getUser() {
    return 'user';
  }
}
