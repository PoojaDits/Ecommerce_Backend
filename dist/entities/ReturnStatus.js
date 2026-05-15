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
exports.ReturnStatus = exports.ReturnState = void 0;
const typeorm_1 = require("typeorm");
const OrderItem_1 = require("./OrderItem");
var ReturnState;
(function (ReturnState) {
    ReturnState["REQUESTED"] = "requested";
    ReturnState["APPROVED"] = "approved";
    ReturnState["REJECTED"] = "rejected";
    ReturnState["RECEIVED"] = "received";
    ReturnState["COMPLETED"] = "completed";
})(ReturnState || (exports.ReturnState = ReturnState = {}));
let ReturnStatus = class ReturnStatus {
};
exports.ReturnStatus = ReturnStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], ReturnStatus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ReturnState, default: ReturnState.REQUESTED }),
    __metadata("design:type", String)
], ReturnStatus.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ReturnStatus.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ReturnStatus.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ReturnStatus.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItem_1.OrderItem, (orderItem) => orderItem.returnStatus),
    __metadata("design:type", Array)
], ReturnStatus.prototype, "orderItems", void 0);
exports.ReturnStatus = ReturnStatus = __decorate([
    (0, typeorm_1.Entity)("return_statuses")
], ReturnStatus);
//# sourceMappingURL=ReturnStatus.js.map