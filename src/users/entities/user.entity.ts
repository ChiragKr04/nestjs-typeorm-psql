import { BaseEntity } from '../../entities/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  address: string;
}
