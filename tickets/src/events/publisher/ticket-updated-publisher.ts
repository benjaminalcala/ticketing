import { Subjects, TicketUpdatedEvent, Publisher } from "@bamtickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
  
}