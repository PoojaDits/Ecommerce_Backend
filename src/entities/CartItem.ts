// ============================================================
//  CartItem Entity  (beginner friendly version)
//  This is one row inside a cart.
//  It says: "this product, this many times, in this cart".
// ============================================================

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

// This creates a table called "cartItems" in the database.
@Entity("cartItems")
export class CartItem {
  // Unique id for each cart item (auto increases: 1, 2, 3...).
  @PrimaryGeneratedColumn("increment")
  id: number;

  // How many of this product the user wants.
  @Column({ type: "int" })
  quantity: number;

  // The date this item was added (set automatically).
  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  // The date this item was last changed (set automatically).
  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  // Which cart this item belongs to.
  // Many items can belong to one cart.
  // If the cart is deleted, its items are deleted too (CASCADE).
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  // Which product this item is for.
  // "eager: true" means the product info loads automatically with the item.
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;
}
