import { GqlAuthGuard } from '../guards/graphql.guard';
import { Args, Mutation, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { Session } from 'src/models/session.model';

@UseGuards(new GqlAuthGuard())
export class MutationResolver {
  constructor() {}

  @Mutation(() => User)
  async createUser() {
    return 'string';
  }
}
