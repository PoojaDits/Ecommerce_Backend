import { User } from "./User";
import Product from "./Product";
export declare class Store {
    id: number;
    storeName: string;
    storeDescription: string;
    storeLocation: string;
    storeContact: string;
    storeEmail: string;
    created_at: Date;
    updated_at: Date;
    user: User;
    products: Product[];
}
//# sourceMappingURL=Store.d.ts.map