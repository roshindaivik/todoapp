import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: 3306,
  username: process.env.DB_USER,
  database: process.env.DB_TEST,
  password: process.env.PASSWORD,
  entities: ["src/entity/*{.ts,.js}"],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
