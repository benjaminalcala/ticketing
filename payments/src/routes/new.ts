import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, NotAuthorizedError, validateRequest, requireAuth, OrderStatus } from "@bamtickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Payment } from '../models/payment';
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";



const router = express.Router();


router.post('/api/payments', requireAuth, [
  body('orderId').not().isEmpty(),
  body('token').not().isEmpty(),
], validateRequest,
async (req:Request, res: Response) => {
  const {orderId, token} = req.body;

  const order = await Order.findById(orderId);

  if(!order){
    throw new NotFoundError()
  }

  if(req.currentUser!.id !== order.userId){
    throw new NotAuthorizedError();
  }

  if(order.status === OrderStatus.Cancelled){
    throw new BadRequestError('You can not pay for a cancelled order');
  }

  const stripeCharge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token
  })

  const payment = Payment.build({
    orderId,
    chargeId: stripeCharge.id
  });
  await payment.save();
  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    chargeId: payment.chargeId
  })
  res.status(201).send({id: payment.id})

})

export {router as createChargeRouter};