import * as jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { CustomRequest, DecodedToken } from "../types/common";

export const Authenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string | undefined | null = req.header("Authorization");
    if (!token) {
      throw new Error();
    }
    const result = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as DecodedToken;
    if (!result) {
      throw new Error("missing token");
    }
    req.userId = result.userId;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "Missing Jwt token" });
  }
};
