import { OrderItem } from "./OrderItem";
import { ReturnState } from "../enums";
export declare class ReturnStatus {
    id: number;
    status: ReturnState;
    note: string;
    created_at: Date;
    updated_at: Date;
    orderItems: OrderItem[];
}
//# sourceMappingURL=ReturnStatus.d.ts.map