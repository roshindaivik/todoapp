import * as expressWinston from "express-winston";
import { Authenticate } from "./middleware/auth";
import express from "express";
import userRoutes from "./routes/userRoutes";
import todoRoutes from "./routes/todoRoutes";
import logger from "./util/logger";

function createServer() {
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
  app.get("/api/users", (req, res) => {
    res.status(200).json({ users: [{ id: 1, name: "John Doe" }] });
  });

  return app;
}

export default createServer;
