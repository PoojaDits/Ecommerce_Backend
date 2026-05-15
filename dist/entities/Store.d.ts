import { User } from "./User";
import Product from "./Product";
export declare class Store {
    id: number;
    StoreName: string;
    StoreDescription: string;
    StoreLocation: string;
    storeContact: string;
    StoreEmail: string;
    created_at: Date;
    updated_at: Date;
    user: User;
    products: Product[];
}
//# sourceMappingURL=Store.d.ts.map