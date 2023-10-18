import AppDataSource from "../util/data-source";
import User from "../entity/User";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { generateToken } from "../util/validators";
import logger from "../util/logger";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, email } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user: User = new User();
    user.email = email;
    user.password = password;
    user.username = username;
    const userInserted = await userRepo.save(user);
    const token: string = generateToken(userInserted);
    return res.status(201).json({ msg: "success", token });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "failed", err });
  }
};
