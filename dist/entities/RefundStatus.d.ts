import { Payment } from "./Payment";
import { RefundState } from "../enums";
export declare class RefundStatus {
    id: number;
    status: RefundState;
    note: string;
    created_at: Date;
    updated_at: Date;
    payments: Payment[];
}
//# sourceMappingURL=RefundStatus.d.ts.map