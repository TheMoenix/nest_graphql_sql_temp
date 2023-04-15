import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';

import { User } from 'src/models/user.model';
import { CreateUserArgs } from 'src/common/args';
import { SessionService } from './session.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly sessionService: SessionService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(user: CreateUserArgs) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (userExists) throw new Error('User Already Exists!!');
      const newUser = await this.userRepository.insert(user);
      return newUser;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async userLogin(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || user.password !== password) return UnauthorizedException;
    return await this.sessionService.createNewSession(user);
  }
}
