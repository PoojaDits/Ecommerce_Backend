import { Entity,OneToMany,OneToOne,PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";
import { CartItem } from "./CartItem";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToOne(()=>User,(user)=>user.cart)
  @JoinColumn({ name: "user_id" })
  user: User;

   @OneToMany(() => Order, (order) => order.cart)
   orders: Order[];

   @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
   items: CartItem[];

}