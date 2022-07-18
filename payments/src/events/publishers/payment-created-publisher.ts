import { Publisher, PaymentCreatedEvent, Subjects } from "@bamtickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  readonly subject = Subjects.PaymentCreated;

}