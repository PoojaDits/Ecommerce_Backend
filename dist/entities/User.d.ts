import { Store } from './Store';
import { Order } from './Order';
import { Address } from './Address';
import { Cart } from './Cart';
import { Otp } from './Otp';
import { UserRole } from '../enums';
export declare class User {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    store: Store[];
    orders: Order[];
    address: Address[];
    otps: Otp[];
    cart: Cart;
}
//# sourceMappingURL=User.d.ts.map