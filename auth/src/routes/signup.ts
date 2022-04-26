import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signup', 
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email adddress'),
    body('password')
      .trim()
      .isLength({min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters')
  ], 
  validateRequest,
  async (req: Request, res: Response) => {

    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      throw new BadRequestError('A user with this email already exists')
    }

    const user = User.build({email, password})
    await user.save()

    const userJwt = jwt.sign(
      {
        email: user.email,
        id: user.id
      }, 
      process.env.JWT_KEY!
      )

    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user)

    
  }
)

export {router as signupRouter};
