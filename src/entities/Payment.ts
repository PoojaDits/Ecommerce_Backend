import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { RefundStatus } from "./RefundStatus";
import { PaymentMethod, PaymentStatus } from "../enums";

@Entity("payments")
export class Payment {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar", unique: true })
    transaction_id: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status: PaymentStatus;


    @Column({
        type: "enum",
        enum: PaymentMethod,
        nullable: true
    })
    method: PaymentMethod;


    @ManyToOne(() => Order, (order) => order.payments)
    @JoinColumn({ name: "order_id" })
    order: Order;

    @ManyToOne(() => RefundStatus, (status) => status.payments, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: "refund_status_id" })
    refundStatus: RefundStatus;
}