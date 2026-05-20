"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpPurpose = exports.RefundState = exports.PaymentStatus = exports.PaymentMethod = exports.ReturnState = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CUSTOMER"] = "customer";
    UserRole["VENDOR"] = "vendor";
})(UserRole || (exports.UserRole = UserRole = {}));
var ReturnState;
(function (ReturnState) {
    ReturnState["REQUESTED"] = "requested";
    ReturnState["APPROVED"] = "approved";
    ReturnState["REJECTED"] = "rejected";
    ReturnState["RECEIVED"] = "received";
    ReturnState["COMPLETED"] = "completed";
})(ReturnState || (exports.ReturnState = ReturnState = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["UPI"] = "upi";
    PaymentMethod["NET_BANKING"] = "net_banking";
    PaymentMethod["WALLET"] = "wallet";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var RefundState;
(function (RefundState) {
    RefundState["INITIATED"] = "initiated";
    RefundState["PENDING"] = "pending";
    RefundState["COMPLETED"] = "completed";
    RefundState["FAILED"] = "failed";
    RefundState["REVERSED"] = "reversed";
})(RefundState || (exports.RefundState = RefundState = {}));
var OtpPurpose;
(function (OtpPurpose) {
    OtpPurpose["REGISTRATION"] = "registration";
    OtpPurpose["VERIFY_EMAIL"] = "verify_email";
    OtpPurpose["FORGOT_PASSWORD"] = "forgot_password";
})(OtpPurpose || (exports.OtpPurpose = OtpPurpose = {}));
//# sourceMappingURL=index.js.map