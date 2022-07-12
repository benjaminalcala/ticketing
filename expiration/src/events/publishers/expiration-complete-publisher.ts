import { Publisher, ExpirationCompleteEvent, Subjects } from "@bamtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject =  Subjects.ExpirationComplete;
}