import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { StatusTodo } from "../enums/StatusTodo";
import User from "./User";

@Entity()
class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  task: string;

  @Column({ type: "enum", enum: StatusTodo, default: StatusTodo.Pending })
  status: StatusTodo;

  @ManyToOne(() => User, (user: User) => user.todos)
  user: User;
}

export default Todo;
