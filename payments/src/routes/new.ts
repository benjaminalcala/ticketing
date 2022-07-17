import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, NotAuthorizedError, validateRequest, requireAuth, OrderStatus } from "@bamtickets/common";
import { body } from "express-validator";
import { Order, } from "../models/order";
import { stripe } from "../stripe";



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

  await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token
  })

  res.status(201).send({success: true})

})

export {router as createChargeRouter};