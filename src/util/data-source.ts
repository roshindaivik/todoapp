import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: 3306,
  username: process.env.DB_USER,
  database: "todoapp",
  password: process.env.PASSWORD,
  entities: ["src/entity/*{.ts,.js}"],
  synchronize: true,
  logging: true,
});

export default AppDataSource;
