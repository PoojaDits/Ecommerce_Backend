import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";
import { Shipment } from "./Shipment";
import { Address } from "./Address";
import { Cart } from "./Cart";
export declare class Order {
    id: number;
    totalAmount: number;
    user: User;
    orderItems: OrderItem[];
    payments: Payment[];
    shipments: Shipment[];
    address: Address;
    cart: Cart;
}
//# sourceMappingURL=Order.d.ts.map