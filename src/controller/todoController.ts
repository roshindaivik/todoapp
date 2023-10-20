import { Response } from "express";
import { CustomRequest } from "../types/common";
import { Result, ValidationError, validationResult } from "express-validator";
import logger from "../util/logger";
import TodoService from "../services/todo.service";

export const createTodo = async (req: CustomRequest, res: Response) => {
  try {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await new TodoService().createTodo(
      req.userId,
      req.body.task,
    );
    return res.status(response.statusCode).send({ ...response.result });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "Something went wrong", err });
  }
};

export const getTodo = async (req: CustomRequest, res: Response) => {
  try {
    const response = await new TodoService().getTodo(req.userId);
    return res.status(response.statusCode).send({ ...response.result });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "failed to retrieve user todos", err });
  }
};

export const delTodo = async (req: CustomRequest, res: Response) => {
  try {
    const response = await new TodoService().delTodo(
      req.params.todoId,
      req.userId,
    );
    return res.status(response.statusCode).send({ ...response.result });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "failed", err });
  }
};

//To be integrated
//prettier and services
//hashmap and sets
