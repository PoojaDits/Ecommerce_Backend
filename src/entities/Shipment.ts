import { Entity, JoinColumn } from "typeorm";
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { ShipmentTracking } from "./ShipmentTracking";

@Entity("shipments")
export class Shipment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  carrier: string;

  @Column({ type: "varchar" })
  trackingNumber: string;

  @ManyToOne(() => Order, (order) => order.shipments)
  @JoinColumn({ name: "order_id" })
  order: Order;

  @OneToMany(
    () => ShipmentTracking,
    (tracking) => tracking.shipment // points to the 'shipment' property in ShipmentTracking
  )
  shipment_trackings: ShipmentTracking[];
}
