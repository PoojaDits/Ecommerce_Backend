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

export enum AddressType {
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}

/**
 * Order-level lifecycle (derived from shipment tracking).
 * This is the overall state of the order, not stored on the Order entity
 * but computed from shipments + shipment_trackings.
 */
export enum OrderLifecycle {
  /** Order placed, no shipment yet — cancellable */
  PENDING = "pending",
  /** Shipment label created — still cancellable (pre-dispatch) */
  PACKED = "packed",
  /** Physically handed to carrier — no longer cancellable */
  SHIPPED = "shipped",
  /** Out for local delivery */
  OUT_FOR_DELIVERY = "out_for_delivery",
  /** Delivered to customer */
  DELIVERED = "delivered",
}