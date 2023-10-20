import { Response } from "express";
import { CustomRequest } from "../types/common";
import { Result, ValidationError, validationResult } from "express-validator";
import AppDataSource from "../util/data-source";
import User from "../entity/User";
import Todo from "../entity/Todo";
import RedisClient from "../util/client";
import { Repository } from "typeorm";
import logger from "../util/logger";

export const createTodo = async (req: CustomRequest, res: Response) => {
  try {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    const userRepo: Repository<User> = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const todoRepo: Repository<Todo> = AppDataSource.getRepository(Todo);
    const todo: Todo = new Todo();
    todo.task = req.body.task;
    todo.user = user;
    const todoInserted: Todo = await todoRepo.save(todo);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultTodo = (({ user, ...rest }) => rest)(todoInserted);
    const redisKey: string = `todo:${userId}`;
    const keyExists = await RedisClient.exists(redisKey);
    if (keyExists) {
      await RedisClient.rpush(redisKey, JSON.stringify(resultTodo));
    }
    return res.status(201).json({
      msg: "successfully inserted todo",
      todo: resultTodo,
    });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "Something went wrong", err });
  }
};

export const getTodo = async (req: CustomRequest, res: Response) => {
  try {
    const userId: number | undefined | null = req.userId;
    const redisKey: string = `todo:${userId}`;
    const cachedResult: string[] = await RedisClient.lrange(redisKey, 0, -1);
    let todos: Todo[];
    if (cachedResult.length > 0) {
      todos = cachedResult.map((resultTodo: string) => JSON.parse(resultTodo));
      return res
        .status(200)
        .json({ msg: "successfully retrieved todo", todos });
    }
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const todoRepo = AppDataSource.getRepository(Todo);
    todos = await todoRepo.find({ where: { user: user } });
    todos.forEach((singleTodo) => {
      RedisClient.rpush(redisKey, JSON.stringify(singleTodo));
    });
    RedisClient.expire(redisKey, 100);
    return res.status(200).json({
      msg: "successfully retrieved todo",
      todos,
    });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "failed to retrieve user todos", err });
  }
};

export const delTodo = async (req: CustomRequest, res: Response) => {
  try {
    const todoId: string | undefined | null = req.params.todoId;
    if (!todoId) {
      return res.status(404).json({ msg: "check todoId" });
    }
    const todoRepo: Repository<Todo> = AppDataSource.getRepository(Todo);
    const todoToDelete: Todo | null = await todoRepo.findOne({
      where: { id: Number(todoId) },
      relations: ["user"],
    });
    if (!todoToDelete) {
      return res.status(404).json({ msg: "Todo not found" });
    }
    if (todoToDelete.user.id !== req.userId) {
      return res.status(403).json({
        msg: "Unauthorized: You are not the creator of this todo.",
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultTodo = (({ user, ...rest }) => rest)(todoToDelete);
    await todoRepo.remove(todoToDelete);
    const redisKey: string = `todo:${req.userId}`;
    await RedisClient.lrem(redisKey, 1, JSON.stringify(resultTodo));
    return res.status(204).json({
      msg: "successfully delted todo",
      resultTodo,
    });
  } catch (err) {
    logger.error("Internal Server Error", { error: err });
    return res.status(500).json({ msg: "failed", err });
  }
};

//To be integrated
//prettier and services
//hashmap and sets
