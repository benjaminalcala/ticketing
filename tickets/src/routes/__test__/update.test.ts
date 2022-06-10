import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';
import {natsWrapper} from '../../nats-wrapper';


it('return a 404 if the ticket id that is provided does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
  .put(`/api/tickets/${id}`)
  .set('Cookie', global.signin())
  .send({
    title:'title',
    price: 20
  })
  .expect(404)


})

it('return a 401 if the user is not signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
  .put(`/api/tickets/${id}`)
  .send({
    title:'title',
    price: 20
  })
  .expect(401)
  
})

it('return a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', global.signin())
  .send({
    title:'title',
    price: 20
  })
  
  
  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', global.signin())
  .send({
    title:'newtitle',
    price: 30
  })
  .expect(401)
  
})

it('return a 400 if the title or price that is provided is invalid', async () => {
  const cookie = global.signin();
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title:'title',
    price: 20
  })

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title:'',
    price: 20
  })
  .expect(400)

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title:'title',
    price: -20
  })
  .expect(400)

  
})

it('return a 200 if the ticket is updated successfully', async () => {
  const cookie = global.signin();
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title:'title',
    price: 20
  })

   await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title:'newtitle',
    price: 30
  })

  const ticketReponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()


  expect(ticketReponse.body.title).toEqual('newtitle');
  expect(ticketReponse.body.price).toEqual(30);

  
})

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title:'title',
    price: 20
  })

   await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title:'newtitle',
    price: 30
  })

  const ticketReponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()


  expect(ticketReponse.body.title).toEqual('newtitle');
  expect(ticketReponse.body.price).toEqual(30);

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})