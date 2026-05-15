"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shipment = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const Order_1 = require("./Order");
const shipmentTracking_1 = require("./shipmentTracking");
let Shipment = class Shipment {
};
exports.Shipment = Shipment;
__decorate([
    (0, typeorm_2.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Shipment.prototype, "id", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Shipment.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_2.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Shipment.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_2.ManyToOne)(() => Order_1.Order, (order) => order.shipments),
    (0, typeorm_1.JoinColumn)({ name: "order_id" }),
    __metadata("design:type", Order_1.Order)
], Shipment.prototype, "order", void 0);
__decorate([
    (0, typeorm_2.OneToMany)(() => shipmentTracking_1.ShipmentTracking, (tracking) => tracking.shipment // points to the 'shipment' property in ShipmentTracking
    ),
    __metadata("design:type", Array)
], Shipment.prototype, "shipment_trackings", void 0);
exports.Shipment = Shipment = __decorate([
    (0, typeorm_1.Entity)("shipments")
], Shipment);
//# sourceMappingURL=Shipment.js.map