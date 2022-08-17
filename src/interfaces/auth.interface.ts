import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
}

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
