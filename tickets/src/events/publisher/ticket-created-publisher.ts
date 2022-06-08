import { Subjects, TicketCreatedEvent, Publisher } from "@bamtickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
  
}