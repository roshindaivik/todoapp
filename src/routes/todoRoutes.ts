import { Router } from "express";
import { createTodo, delTodo, getTodo } from "../controller/todoController";
import { validateTodo } from "../util/validators";

const router = Router();

router.post("/create-todo", validateTodo, createTodo);
router.get("/get-todo", getTodo);
router.delete("/del-todo/:todoId", delTodo);

export default router;
