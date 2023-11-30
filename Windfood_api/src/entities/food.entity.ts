import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Provider } from "./provider.entity";
import { Category } from "./category.entity";
import { FoodBill } from "./foodbill.entity";

@Entity({ name: "food" })
export class Food {
  @PrimaryGeneratedColumn({ name: "food_id" })
  foodId: number;

  @Column({ name: "food_name", length: 255, collation: 'utf8mb4_vietnamese_ci' })
  foodName?: string;

  @Column({ name: "quantity" })
  quantity?: number;

  @Column({ name: "import_price" })
  importPrice?: number;

  @Column({ name: "price" })
  price?: number;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @Column({ name: "url_img", type: "text", nullable: true })
  urlImg?: string;

  @Column({ name: "create_date", default: null })
  createDate?: Date;

  @ManyToOne((type) => Provider, { cascade: true, onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "provider_id" })
  provider?: Provider;

  @ManyToOne((type) => Category, { cascade: true, onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "category_id" })
  category?: Category;

  @OneToMany(() => FoodBill, (foodbill) => foodbill.food)
  foodBills?: FoodBill[];
}
