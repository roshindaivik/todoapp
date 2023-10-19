import { transports, format, createLogger } from "winston";
import "winston-mongodb";

const logger = createLogger({
  transports: [
    new transports.File({
      level: "warn",
      filename: "logs/logsWarnings.log",
    }),
    new transports.File({
      level: "error",
      filename: "logs/logsError.log",
    }),
    // new transports.MongoDB({
    //   db: process.env.MONGO_URI as string,
    //   options: { useNewUrlParser: true, useUnifiedTopology: true },
    //   collection: "logs",
    // }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.metadata(),
    format.prettyPrint()
  ),
});

export default logger;
