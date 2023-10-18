import { body, ValidationChain } from "express-validator";
import AppDataSource from "./data-source";
import User from "../entity/User";
import * as jwt from "jsonwebtoken";

export const validateTodo: ValidationChain[] = [
  body("task").trim().notEmpty().withMessage("Task Cannot be empty"),
];

export const validateUserCredentials: ValidationChain[] = [
  body("email")
    .isEmail()
    .custom(async (value) => {
      const userRepo = AppDataSource.getRepository(User);
      const existingUser = await userRepo.findOne({ where: { email: value } });
      if (existingUser) {
        throw new Error("A user already exists with this e-mail address");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Min Character length is 6"),
  body("username")
    .isLength({ max: 6 })
    .withMessage("Max Character length is 6"),
];

export function generateToken(user: User): string {
  const token: string = jwt.sign(
    { userId: user.id },
    process.env.SECRET_KEY as string
  );
  return token;
}
