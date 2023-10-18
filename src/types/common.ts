import { Request } from "express";

export interface DecodedToken {
  userId: number;
  iat: number;
}

export interface CustomRequest extends Request {
  userId?: number;
}
