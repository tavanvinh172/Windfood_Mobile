import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Bill } from "./bill.entity";

@Entity({ name: "person" })
export class Person {
  @PrimaryGeneratedColumn({ name: "person_id" })
  personId: number;

  @Column({ name: "username", length: 255, unique: true })
  username?: string;

  @Column({ name: "hashed_password", length: 255 })
  password?: string;

  @Column({ name: "role" })
  role?: number;   //admin: 0, staff: 1

  @Column({ name: "name", length: 255, collation: 'utf8mb4_vietnamese_ci' })
  name?: string;

  @Column({ name: "phone_number", length: 10, nullable: true })
  phoneNumber?: string;

  @Column({ name: "birthday", type: "date" })
  birthday?: Date;

  @Column({ name: "url_img", type: "text", nullable: true })
  urlImg?: string;

  @Column({ name: "token", type: "text", nullable: true })
  token?: string;

  @Column({ name: "create_date", default: null })
  createDate?: Date;

  @OneToMany(() => Bill, (bill) => bill.creator)
  bills?: Bill[];
}
