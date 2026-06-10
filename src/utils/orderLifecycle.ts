import { OrderLifecycle } from "../enums";

export const ORDER_LIFECYCLE_STAGES: OrderLifecycle[] = [
  OrderLifecycle.PENDING,
  OrderLifecycle.PACKED,
  OrderLifecycle.SHIPPED,
  OrderLifecycle.OUT_FOR_DELIVERY,
  OrderLifecycle.DELIVERED,
];


export const CANCELLATION_CUTOFF = OrderLifecycle.SHIPPED;


export const isCancellationAllowed = (stage: OrderLifecycle): boolean => {
  const stageIndex = ORDER_LIFECYCLE_STAGES.indexOf(stage);
  const cutoffIndex = ORDER_LIFECYCLE_STAGES.indexOf(CANCELLATION_CUTOFF);
  return stageIndex !== -1 && stageIndex < cutoffIndex;
};