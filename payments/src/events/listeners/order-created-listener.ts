import { Listener, Subjects, OrderCreatedEvent, OrderStatus } from "@bamtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  readonly subject =  Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      userId: data.userId,
      version: data.version,
      id: data.id,
      price: data.ticket.price,
      status: data.status
    })

    await order.save()

    msg.ack()
      
  }
}