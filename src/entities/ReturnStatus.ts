import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";
import { ReturnState } from "../enums";

@Entity("return_statuses")
export class ReturnStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "enum", enum: ReturnState, default: ReturnState.REQUESTED })
  status: ReturnState;

  @Column({ type: "text", nullable: true })
  note: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.returnStatus)
  orderItems: OrderItem[];
}
