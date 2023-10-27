import { Request as ExpressRequest } from 'express';
import { UserData } from './user-data.interface';

export interface ExpressRequestWithUser extends ExpressRequest {
  user: UserData & { iat: number; exp: number };
}
