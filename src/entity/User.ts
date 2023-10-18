import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from "typeorm";
import Todo from "./Todo";

@Entity()
@Unique(["email"])
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
  })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo: Todo) => todo.user)
  todos: Todo[];
}

export default User;
