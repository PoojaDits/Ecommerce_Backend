import { Column, Entity,OneToMany,PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";
import { Shipment } from "./Shipment";  
import { Address} from "./Address";
import { Cart } from "./Cart";


@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type:"decimal"})
    totalAmount: number;

   @ManyToOne(()=> User,(user)=>
    user.orders)
    user: User;

    @OneToMany(()=>OrderItem,(orderItems)=>orderItems.order)
    orderItems: OrderItem[];

    @OneToMany(()=>Payment,(payments)=>payments.order)
    payments: Payment[];

    @OneToMany(()=>Shipment,(shipments)=>shipments.order)
    shipments: Shipment[];

    @ManyToOne(()=>Address,(addresses)=>addresses.orders)
    @JoinColumn({ name: "address_id" })
    address: Address;

    @ManyToOne(()=>Cart,(cart)=>cart.orders)
    @JoinColumn({ name: "cart_id" })
    cart: Cart;
}