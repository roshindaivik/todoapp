import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { StatusTodo } from "../enums/StatusTodo";
import User from "./User";

@Entity()
class Todo {
  @PrimaryGeneratedColumn()
  id: number; /* eslint-disable-line */

  @Column({ type: "varchar", length: 255 })
  task: string; /* eslint-disable-line */

  @Column({ type: "enum", enum: StatusTodo, default: StatusTodo.Pending })
  status: StatusTodo; /* eslint-disable-line */

  @ManyToOne(() => User, (user: User) => user.todos)
  user: User; /* eslint-disable-line */
}

export default Todo;
