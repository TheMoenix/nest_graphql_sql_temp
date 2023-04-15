import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
// import { User } from './user.entity';

@ObjectType()
@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  token: string;

  @Field()
  @Column()
  lastActivityAt: Date;

  @Field()
  @Column({ default: 'active' })
  status: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  // @JoinColumn({ name: 'user_id' })
  user: User;
}
