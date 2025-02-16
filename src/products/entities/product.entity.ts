import { BaseEntity } from '../../entities/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'float' })
  incl_tax_price: number;

  @Column({ type: 'float' })
  excl_tax_price: number;

  @Column({ nullable: true })
  category: string;

  @BeforeInsert()
  @BeforeUpdate()
  updateInclTaxPrice() {
    if (!this.excl_tax_price) {
      return;
    }
    this.incl_tax_price = this.excl_tax_price + this.excl_tax_price * 0.18;
  }
}
