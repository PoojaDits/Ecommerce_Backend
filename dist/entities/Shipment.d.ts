import { Order } from "./Order";
import { ShipmentTracking } from "./shipmentTracking";
export declare class Shipment {
    id: number;
    carrier: string;
    trackingNumber: string;
    order: Order;
    shipment_trackings: ShipmentTracking[];
}
//# sourceMappingURL=Shipment.d.ts.map