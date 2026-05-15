import { Payment } from "./Payment";
export declare enum RefundState {
    INITIATED = "initiated",
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REVERSED = "reversed"
}
export declare class RefundStatus {
    id: number;
    status: RefundState;
    note: string;
    created_at: Date;
    updated_at: Date;
    payments: Payment[];
}
//# sourceMappingURL=RefundStatus.d.ts.map