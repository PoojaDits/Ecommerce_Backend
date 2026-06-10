import { OrderLifecycle } from "../enums";

/**
 * Ordered list of lifecycle stages from earliest to latest.
 */
export const ORDER_LIFECYCLE_STAGES: OrderLifecycle[] = [
  OrderLifecycle.PENDING,
  OrderLifecycle.PACKED,
  OrderLifecycle.SHIPPED,
  OrderLifecycle.OUT_FOR_DELIVERY,
  OrderLifecycle.DELIVERED,
];

/**
 * The point after which cancellation is no longer allowed.
 */
export const CANCELLATION_CUTOFF = OrderLifecycle.SHIPPED;

/**
 * Check whether the order's current lifecycle stage allows cancellation.
 * Cancellation is allowed for stages BEFORE SHIPPED.
 */
export const isCancellationAllowed = (stage: OrderLifecycle): boolean => {
  const stageIndex = ORDER_LIFECYCLE_STAGES.indexOf(stage);
  const cutoffIndex = ORDER_LIFECYCLE_STAGES.indexOf(CANCELLATION_CUTOFF);
  return stageIndex !== -1 && stageIndex < cutoffIndex;
};