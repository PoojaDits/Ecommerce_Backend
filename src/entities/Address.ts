import { Column, Entity,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";



@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({type:"varchar"})
  street: string;

  @Column({type:"varchar"})
  city: string;

  @Column({type:"varchar"})
  state: string;

  @Column({type:"varchar"})
  postalCode: string;

  @Column({type:"varchar"})
  country: string;              
  
@ManyToOne(()=> User,(user)=>
    user.address)
  @JoinColumn({ name: "user_id" })
  user: User;
  @OneToMany(()=>Order,(order)=>order.address)
  orders: Order[];
}