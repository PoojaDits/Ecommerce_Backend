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
exports.ShipmentTracking = void 0;
const typeorm_1 = require("typeorm");
const Shipment_1 = require("./Shipment");
let ShipmentTracking = class ShipmentTracking {
};
exports.ShipmentTracking = ShipmentTracking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], ShipmentTracking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ShipmentTracking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ShipmentTracking.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ShipmentTracking.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Shipment_1.Shipment, (shipment) => shipment.shipment_trackings, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "shipment_id" }),
    __metadata("design:type", Shipment_1.Shipment)
], ShipmentTracking.prototype, "shipment", void 0);
exports.ShipmentTracking = ShipmentTracking = __decorate([
    (0, typeorm_1.Entity)("shipment_tracking")
], ShipmentTracking);
//# sourceMappingURL=shipmentTracking.js.map