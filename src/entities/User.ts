import{Entity,PrimaryGeneratedColumn, Column, CreateDateColumn, Generated, UpdateDateColumn, OneToMany} from 'typeorm';
import { Store } from './Store';
import { Order } from './Order';
import { Address } from './Address';
import { Cart } from './Cart';
import { Otp } from './Otp';
import { OneToOne } from 'typeorm';
import { UserRole } from '../enums';

@Entity("users")
export class User {
 @PrimaryGeneratedColumn()
  id: number; 

@Column()
@Generated("uuid")
uuid: string;


@Column({type:"varchar"})
firstName:string;

@Column({type:"varchar"})
lastName:string;

@Column({type:"varchar"})
email:string;

@Column({type:"varchar"})
password:string;

 @Column({ 
    type: "enum", 
    enum: UserRole, 
    default: UserRole.CUSTOMER 
})
  role: UserRole;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  
@CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;


  @OneToMany(()=>Store,(store)=>store.user)
  store: Store[];

  @OneToMany(()=>Order,(order)=>order.user)
  orders: Order[];

  @OneToMany(()=>Address,(address)=>address.user)
  address: Address[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToOne(()=>Cart,(cart)=>cart.user)
  cart: Cart;



}
