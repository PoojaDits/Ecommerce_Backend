import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Payment } from "./Payment";

export enum RefundState {
  INITIATED = "initiated",
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed"
}

@Entity("refund_statuses")
export class RefundStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "enum", enum: RefundState, default: RefundState.INITIATED })
  status: RefundState;

  @Column({ type: "text", nullable: true })
  note: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => Payment, (payment) => payment.refundStatus)
  payments: Payment[];
}
