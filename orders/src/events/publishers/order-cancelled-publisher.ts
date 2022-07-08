import { Publisher, Subjects, OrderCancelledEvent } from "@bamtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  readonly subject = Subjects.OrderCancelled;
}