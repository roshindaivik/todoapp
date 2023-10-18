import express from "express";
import userRoutes from "./routes/userRoutes";
import todoRoutes from "./routes/todoRoutes";
import * as dotenv from "dotenv";
import "reflect-metadata";
import AppDataSource from "./util/data-source";
import { Authenticate } from "./middleware/auth";
import logger from "./util/logger";
import * as expressWinston from "express-winston";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

app.use("/user", userRoutes);
app.use("/todo", Authenticate, todoRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT, (): void => {
      console.log("server started");
    });
  })
  .catch((err) => logger.error("Internal Server Error", { error: err }));
