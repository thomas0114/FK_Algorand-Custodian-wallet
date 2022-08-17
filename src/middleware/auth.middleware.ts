import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../authentication/user.entity';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface';
import { logger } from '../utils/logger';
import 'dotenv/config';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization =
      req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = process.env.secret_key;
      const { id } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const findUser = await User.findOne(id, { select: ['id', 'email'] });
      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
