import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Store } from "./Store";
import Category from "./Category";
import { OrderItem } from "./OrderItem";
@Entity("products")
export default class Product {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "decimal" })
    price: number;

    @Column({ type: "int" })
    stock: number;
    @Column({ type: "boolean", default: true })
    isActive: boolean;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;

    @ManyToOne(() => Store, (store) => store.products)
    @JoinColumn({ name: "store_id" })
    store: Store;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "category_id" })
    category: Category;

    @OneToMany(() => OrderItem, (orderItems) => orderItems.product)
    orderItems: OrderItem[];
}       