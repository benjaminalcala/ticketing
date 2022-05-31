import request from 'supertest';
import { app } from '../../app';


it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
})

it('returns a 400 with invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'sdafdsf',
      password: 'sdfdsfs'
    })
    .expect(400)
})

it('returns a 400 with invalid password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email:'test@test.com',
    password: 'a'
  })
  .expect(400)

})

it('returns a 400 with missing password or email', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    password: 'a'
  })

  await request(app)
  .post('/api/users/signup')
  .send({
    email:'test@test.com'
  })
  .expect(400)

})

it('returns a 400 when signing up with existing email', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: '1234'
  })
  .expect(201)

  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: '12345'
  })
  .expect(400)

})