import { Store } from "./Store";
import Category from "./Category";
import { OrderItem } from "./OrderItem";
export default class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
    store: Store;
    category: Category;
    orderItems: OrderItem[];
}
//# sourceMappingURL=Product.d.ts.map