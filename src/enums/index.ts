export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  VENDOR = "vendor"
}

export enum ReturnState {
  REQUESTED = "requested",
  APPROVED = "approved",
  REJECTED = "rejected",
  RECEIVED = "received",
  COMPLETED = "completed"
}

export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  NET_BANKING = "net_banking",
  WALLET = "wallet"
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded"
}

export enum RefundState {
  INITIATED = "initiated",
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed"
}

export enum OtpPurpose {
  REGISTRATION = "registration",
  VERIFY_EMAIL = "verify_email",
  FORGOT_PASSWORD = "forgot_password"
}
