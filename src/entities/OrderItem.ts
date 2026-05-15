import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Product from "./Product";
import { Order } from "./Order";
import { ReturnStatus } from "./ReturnStatus";

@Entity("orderItems")
export class OrderItem {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type:"varchar"})
    productName: string;

    @Column({type:"int"})
    quantity: number;

    @Column({type:"decimal"})
    price: number;


      @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;



  @ManyToOne(()=>Product,(product)=>product.orderItems)
@JoinColumn({name:"product_id"})
product: Product;

@ManyToOne(()=>Order,(order)=>order.orderItems)
@JoinColumn({name:"order_id"})
order: Order;

@ManyToOne(()=>ReturnStatus,(status)=>status.orderItems,{nullable:true,onDelete:'SET NULL'})
@JoinColumn({name:"return_status_id"})
returnStatus: ReturnStatus;
}                                       