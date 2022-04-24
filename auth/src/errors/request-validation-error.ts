import {ValidationError} from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError{
  statusCode = 400;
  constructor(public errors: ValidationError[]){
    super('Request validation error')

    //Needs to be done when built in class is being extended
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors(){
      return this.errors.map(error => {
        return {message: error.msg, field: error.param}
      })
  }

}