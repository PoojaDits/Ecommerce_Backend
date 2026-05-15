import Product from "./Product";
import { Order } from "./Order";
import { ReturnStatus } from "./ReturnStatus";
export declare class OrderItem {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    product: Product;
    order: Order;
    returnStatus: ReturnStatus;
}
//# sourceMappingURL=OrderItem.d.ts.map