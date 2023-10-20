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
  id: number; /* eslint-disable-line */

  @Column({ length: 6 })
  username: string; /* eslint-disable-line */

  @Column()
  email: string; /* eslint-disable-line */

  @Column()
  password: string; /* eslint-disable-line */

  @OneToMany(() => Todo, (todo: Todo) => todo.user)
  todos: Todo[]; /* eslint-disable-line */
}

export default User;
