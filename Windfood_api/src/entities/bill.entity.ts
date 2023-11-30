import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Person } from "./person.entity";
import { FoodBill } from "./foodbill.entity";

@Entity({ name: "bill" })
export class Bill {
  @PrimaryGeneratedColumn({ name: "bill_id" })
  billId: number;

  @Column({ name: "total_price" })
  totalPrice?: number;

  @Column({ name: "create_date", default: null })
  createDate?: Date;

  @Column({ name: "payment_method", length: 255 })
  paymentMethod?: string;

  @ManyToOne((type) => Person, { cascade: true, onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "person_id" })
  creator?: Person;

  @OneToMany(() => FoodBill, (foodbill) => foodbill.bill, { cascade: true, eager: true })
  foodBills?: FoodBill[];
}
