import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher'

console.clear();

const stan = nats.connect('ticketing', '123', {
  url:'http://localhost:4222'
})

stan.on('connect', async ()=>{
  console.log('Publisher connected to NATS')

  const data = {
    id: '123',
    title: 'title',
    price: 20
  }

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish(data)


})