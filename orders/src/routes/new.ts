import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import {requireAuth, validateRequest, NotFoundError, BadRequestError} from '@bamtickets/common';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 60 * 15;


const router  = express.Router();

router.post('/api/orders', requireAuth, [
  body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('Ticket id must be provided')
],validateRequest, async (req: Request, res: Response) => {

  const {ticketId} = req.body;

  const ticket = await Ticket.findById(ticketId);

  if(!ticket){
    throw new NotFoundError();
  }

  const isReserved = await ticket.isReserved();
  if(isReserved){
    throw new BadRequestError('Ticket is already reserved');

    
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })
  await order.save();

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    expiresAt: order.expiresAt.toISOString(),
    userId: order.userId,
    status: order.status,
    ticket:{
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order);
})



export {router as newOrderRouter};