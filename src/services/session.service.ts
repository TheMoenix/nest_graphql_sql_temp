import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/models/session.model';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { CommonService } from './commonService';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly commonService: CommonService,
  ) {}

  private readonly logger = new Logger(SessionService.name);

  async createNewSession(user: User) {
    try {
      const userSession = await this.doesHaveActiveSesstion(user);
      if (userSession) return userSession;
      const token = await this.commonService.encrypt(`${new Date().getTime()}`);
      await this.sessionRepository.insert({
        token,
        user: user,
        lastActivityAt: new Date(),
      });
      return await this.doesHaveActiveSesstion(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async doesHaveActiveSesstion(user) {
    const session = await this.sessionRepository.findOne({
      where: { user, status: 'active' },
    });
    return session;
  }

  @Cron('* * * * * *')
  async checkSessionExpiry() {
    const oneHour = 1000 * 60 * 60;
    const activeSessions = await this.sessionRepository.find({
      where: { status: 'active' },
    });
    const date = new Date();
    for (let index = 0; index < activeSessions.length; index++) {
      const session = activeSessions[index];
      if (
        date.getTime() - new Date(session.lastActivityAt).getTime() >
        oneHour
      ) {
        await this.sessionRepository.update(
          { id: session.id },
          { status: 'expired' },
        );
        this.logger.debug(`session ${session.id} expired`);
      }
    }
  }

  async getSessionInfo(sessionToken: string) {
    try {
      return await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndSelect('session.user', 'user')
        .where({ token: sessionToken })
        .getOne();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async updateLastActivityAt(sessionToken: string) {
    try {
      await this.sessionRepository.update(
        { token: sessionToken },
        { lastActivityAt: new Date() },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
