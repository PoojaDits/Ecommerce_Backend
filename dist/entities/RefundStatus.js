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
exports.RefundStatus = exports.RefundState = void 0;
const typeorm_1 = require("typeorm");
const Payment_1 = require("./Payment");
var RefundState;
(function (RefundState) {
    RefundState["INITIATED"] = "initiated";
    RefundState["PENDING"] = "pending";
    RefundState["COMPLETED"] = "completed";
    RefundState["FAILED"] = "failed";
    RefundState["REVERSED"] = "reversed";
})(RefundState || (exports.RefundState = RefundState = {}));
let RefundStatus = class RefundStatus {
};
exports.RefundStatus = RefundStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], RefundStatus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: RefundState, default: RefundState.INITIATED }),
    __metadata("design:type", String)
], RefundStatus.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], RefundStatus.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], RefundStatus.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], RefundStatus.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.refundStatus),
    __metadata("design:type", Array)
], RefundStatus.prototype, "payments", void 0);
exports.RefundStatus = RefundStatus = __decorate([
    (0, typeorm_1.Entity)("refund_statuses")
], RefundStatus);
//# sourceMappingURL=RefundStatus.js.map