import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { OneToMany } from "typeorm";
import Product from "./Product";


@Entity("stores")
export class Store {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  storeName: string;

  @Column({ type: "text", nullable: true })
  storeDescription: string;

  @Column({ type: "varchar" })
  storeLocation: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  storeContact: string;

  @Column({ type: "varchar" })
  storeEmail: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => User, (user) =>
    user.store)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];



}
