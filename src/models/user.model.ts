import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Session } from './session.model';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('text')
  username: string;

  @Field()
  @Column('text')
  email: string;

  @Field()
  @Column('text', { nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  phone: string;

  @Field()
  @Column('text')
  password: string;

  @Field()
  @Column('boolean', { default: true })
  isActive: boolean;

  @Field(() => Session)
  @OneToOne(() => Session, (session) => session.id)
  @JoinColumn()
  session: Session;
}
