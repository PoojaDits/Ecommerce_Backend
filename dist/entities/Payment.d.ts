import { Order } from "./Order";
import { RefundStatus } from "./RefundStatus";
import { PaymentMethod, PaymentStatus } from "../enums";
export declare class Payment {
    id: number;
    transaction_id: string;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    order: Order;
    refundStatus: RefundStatus;
}
//# sourceMappingURL=Payment.d.ts.map