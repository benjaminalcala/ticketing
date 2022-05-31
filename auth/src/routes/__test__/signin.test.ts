import request from 'supertest'
import { app } from '../../app';

it('returns a 400 when an email that does not exist is supplied', async () => {
  await request(app)
  .post('api/users/signin')
  .send({
    email: 'test@test.com',
    password: '11234'
  })
})

it('returns a 400 when an incorrect password is supplied', async() => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: '1234'
  })

  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: '12345'
  })
})

it('returns a 200 upon successful signin', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: '1234'
  })
  .expect(201)

  request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: '1234'
  })
  .expect(200)
})

it('sets a cookie after successful signin', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: '1234'
  })
  .expect(201)

  const response = await request(app)
  .post('/api/users/signin')
  .send({
    email: 'test@test.com',
    password: '1234'
  })
  .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined();
})
