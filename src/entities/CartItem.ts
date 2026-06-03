import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Cart } from "./Cart";
import Product from "./Product";

@Entity("cartItems")
export class CartItem {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "int" })
    quantity: number;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cart_id" })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "product_id" })
    product: Product;
}
