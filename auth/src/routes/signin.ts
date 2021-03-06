import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@bamtickets/common';


import { Password } from '../services/password';
import { User } from '../models/user';




const router = express.Router();

router.post('/api/users/signin', 
[
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must not be empty')
],
validateRequest,
async(req: Request, res: Response) => {
  const {email, password } = req.body;

  const existingUser = await User.findOne({email});
  if(!existingUser){
    throw new BadRequestError('Invalid credentials')
  }

  const passwordMatches = await Password.compare(existingUser.password, password);
  if(!passwordMatches){
    throw new BadRequestError('Invalid credentials')
  }

  const userJwt = jwt.sign(
    {
      email: existingUser.email,
      id: existingUser.id
    }, 
    process.env.JWT_KEY!
    )

  req.session = {
    jwt: userJwt
  }

  res.status(200).send(existingUser)


})

export {router as signinRouter};
