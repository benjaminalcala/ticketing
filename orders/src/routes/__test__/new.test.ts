import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import {natsWrapper} from '../../nats-wrapper';

it('returns a 404 when trying to create an order with an invalid ticket', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({
    ticketId
  })
  .expect(404);

})

it('returns a 400 when trying to create an order with a reserved ticket', async () => {
  const ticket = Ticket.build({
    title: 'order',
    price: 200
  })
  await ticket.save();

  const order = Order.build({
    userId: 'order',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ticketId: ticket.id})
  .expect(400)
  
})

it('returns a 201 when successfully creating an order', async () => {
  const ticket = new Ticket({
    title: 'order',
    price: 200
  })
  await ticket.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ticketId: ticket.id})
  .expect(201)

  
})

it('emits an order created event', async () => {
  const ticket = new Ticket({
    title: 'order',
    price: 200
  })
  await ticket.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ticketId: ticket.id})
  .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

})

