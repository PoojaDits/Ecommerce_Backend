import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItem";

export enum ReturnState {
  REQUESTED = "requested",
  APPROVED = "approved",
  REJECTED = "rejected",
  RECEIVED = "received",
  COMPLETED = "completed"
}

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
