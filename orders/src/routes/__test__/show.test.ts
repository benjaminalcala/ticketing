import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';


it('returns a 401 if a user tries to fetch another users order', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save();

  const user = global.signin();

  const {body: order} = await request(app)
  .post('/api/orders')
  .set('Cookie', user)
  .send({ticketId: ticket.id})
  .expect(201)


  await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie', global.signin())
  .send()
  .expect(401)
})