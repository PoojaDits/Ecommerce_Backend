import { OrderItem } from "./OrderItem";
export declare enum ReturnState {
    REQUESTED = "requested",
    APPROVED = "approved",
    REJECTED = "rejected",
    RECEIVED = "received",
    COMPLETED = "completed"
}
export declare class ReturnStatus {
    id: number;
    status: ReturnState;
    note: string;
    created_at: Date;
    updated_at: Date;
    orderItems: OrderItem[];
}
//# sourceMappingURL=ReturnStatus.d.ts.map