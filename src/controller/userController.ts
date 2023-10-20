import { Request, Response } from "express";
import logger from "../util/logger";
import UserService from "../services/user.service";
import { validationResult } from "express-validator";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await new UserService().registerUser(req.body);
    return res.status(response.statusCode).json({ ...response.result });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "failed", err });
  }
};
