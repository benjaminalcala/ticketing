import express, {Request, Response, NextFunction} from 'express';
import { idText } from 'typescript';

const router = express.Router();

router.post('/api/users/signout', (req: Request, res: Response, next: NextFunction) => {
  req.session = null;

  res.send({})
})

export {router as signoutRouter};
