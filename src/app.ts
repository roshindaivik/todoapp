import * as dotenv from "dotenv";
import "reflect-metadata";
import AppDataSource from "./util/data-source";
import logger from "./util/logger";
import createServer from "./server";

dotenv.config();
const app = createServer();

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT, (): void => {
      console.log("server started");
    });
  })
  .catch((err) => logger.error("Internal Server Error", { error: err }));

export default app;
