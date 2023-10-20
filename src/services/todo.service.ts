import Todo from "../entity/Todo";
import User from "../entity/User";
import AppDataSource from "../util/data-source";
import RedisClient from "../util/client";

class TodoService {
  private userRepository = AppDataSource.getRepository(User);
  private todoRepository = AppDataSource.getRepository(Todo);

  async createTodo(userId: number | undefined, task: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return {
        result: {
          success: false,
          msg: "User not found",
        },
        statusCode: 404,
      };
    }
    const todo: Todo = new Todo();
    todo.task = task;
    todo.user = user;
    const todoInserted: Todo = await this.todoRepository.save(todo);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultTodo = (({ user, ...rest }) => rest)(todoInserted);
    const redisKey: string = `todo:${userId}`;
    const keyExists = await RedisClient.exists(redisKey);
    if (keyExists) {
      await RedisClient.rpush(redisKey, JSON.stringify(resultTodo));
    }
    return {
      result: {
        msg: "successfully inserted todo",
        todo: resultTodo,
        success: true,
      },
      statusCode: 201,
    };
  }

  async getTodo(userId: number | undefined) {
    const redisKey: string = `todo:${userId}`;
    const cachedResult: string[] = await RedisClient.lrange(redisKey, 0, -1);
    let todos: Todo[];
    if (cachedResult.length > 0) {
      todos = cachedResult.map((resultTodo: string) => JSON.parse(resultTodo));
      return {
        result: { sucess: true, msg: "successfully retrieved todo", todos },
        statusCode: 200,
      };
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { result: { msg: "User not found" }, statusCode: 400 };
    }
    todos = await this.todoRepository.find({ where: { user: user } });
    todos.forEach((singleTodo) => {
      RedisClient.rpush(redisKey, JSON.stringify(singleTodo));
    });
    RedisClient.expire(redisKey, 100);
    return {
      result: { sucess: true, msg: "successfully retrieved todo", todos },
      statusCode: 200,
    };
  }

  async delTodo(todoId: string | undefined | null, userId: number | undefined) {
    if (!todoId) {
      return { result: { msg: "check todoId" }, statusCode: 404 };
    }
    const todoToDelete: Todo | null = await this.todoRepository.findOne({
      where: { id: Number(todoId) },
      relations: ["user"],
    });
    if (!todoToDelete) {
      return { result: { msg: "Todo not found" }, statusCode: 404 };
    }
    if (todoToDelete.user.id !== userId) {
      return {
        result: { msg: "Unauthorized: You are not the creator of this todo." },
        statusCode: 403,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultTodo = (({ user, ...rest }) => rest)(todoToDelete);
    await this.todoRepository.remove(todoToDelete);
    const redisKey: string = `todo:${userId}`;
    await RedisClient.lrem(redisKey, 1, JSON.stringify(resultTodo));
    return {
      result: { msg: "successfully delted todo" },
      statusCode: 204,
    };
  }
}

export default TodoService;
