import { Order } from "./Order";
import { RefundStatus } from "./RefundStatus";
export declare enum PaymentMethod {
    CARD = "card",
    UPI = "upi",
    NET_BANKING = "net_banking",
    WALLET = "wallet"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Payment {
    id: number;
    transaction_id: number;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    order: Order;
    refundStatus: RefundStatus;
}
//# sourceMappingURL=Payment.d.ts.map