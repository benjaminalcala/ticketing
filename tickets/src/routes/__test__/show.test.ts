import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

it('responds with a 404 if no ticket is found', async() => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
  .get(`/api/tickets/${id}`)
  .send()
  .expect(404)

})

it('responds with the ticket if the ticket is found is found', async() => {
  const title = 'concert';
  const price = 20;
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title, price})

  const showResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  .expect(200)

  expect(showResponse.body.title).toEqual(title);
  expect(showResponse.body.price).toEqual(price);



})