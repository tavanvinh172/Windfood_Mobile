import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Bill } from "./bill.entity";
import { Food } from "./food.entity";

@Entity({ name: "food_bill" })
export class FoodBill {
  @PrimaryGeneratedColumn({ name: "food_bill_id" })
  foodBillId: number;

  @Column({ name: "quantity" })
  quantity?: number;

  @Column({ name: "create_date", default: null })
  createDate?: Date;

  @ManyToOne((type) => Food, { cascade: ["insert", "update"], onDelete: "SET NULL", eager: true })
  @JoinColumn({ name: "food_id" })
  food?: Food;

  @ManyToOne((type) => Bill, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bill_id" })
  bill?: Bill;
}
