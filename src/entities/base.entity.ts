import { Transform } from 'class-transformer';
import * as moment from 'moment-timezone';
import {
  AfterLoad,
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Transform(({ value }) => moment(value).tz('Asia/Kolkata').format())
  @CreateDateColumn()
  createdAt: Date | string;

  @Transform(({ value }) => moment(value).tz('Asia/Kolkata').format())
  @UpdateDateColumn()
  updatedAt: Date | string;

  @BeforeInsert()
  updateTimestampToIST() {
    this.createdAt = new Date(moment().tz('Asia/Kolkata').format());
    this.updatedAt = new Date(moment().tz('Asia/Kolkata').format());
  }

  @AfterLoad()
  afterLoad() {
    this.createdAt = moment(this.createdAt)
      .tz('Asia/Kolkata')
      .format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = moment(this.updatedAt)
      .tz('Asia/Kolkata')
      .format('YYYY-MM-DD HH:mm:ss');
  }
}
