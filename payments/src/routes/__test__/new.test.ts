import mongoose from 'mongoose';
import request from 'supertest';
import {OrderStatus} from '@bamtickets/common';
import { Order } from '../../models/order';
import { app } from '../../app';
import {stripe} from '../../stripe';

jest.mock('../../stripe');



it('return a 404 when the use is attempting to pay for an order that does not exist', async () => {

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({orderId: new mongoose.Types.ObjectId().toHexString(), token: 'sfs'})
  .expect(404)

})

it('return a 401 when the user attempting to pay is not the user that created the order', async () => {
  const order = Order.build({
    version: 0,
    price: 20,
    status: OrderStatus.Created,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString()
  })
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: 'asdads',
    orderId: order.id
  })
  .expect(401)


})

it('return a 400 when the user is attempting to pay for an order that has been cancelled ', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId
  })
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({orderId: order.id, token: 'sfs'})
  .expect(400)

  
})

it('returns a 201 with valid inputs', async () => {

  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    version: 0,
    price: 20,
    status: OrderStatus.Created,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId
  })
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({orderId: order.id, token: 'tok_visa'})
  .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.currency).toEqual('usd');
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(order.price * 100);


})