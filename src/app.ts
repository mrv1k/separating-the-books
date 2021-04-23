import cors from "cors";
import debug from "debug";
import express, { ErrorRequestHandler } from "express";
import expressWinston from "express-winston";
import createError from "http-errors";
import winston from "winston";

import launchMongoDB from "@/db";
import authorsRouter from "@/routes/authors";
import booksRouter from "@/routes/books";

launchMongoDB();
const app = express();

const debugLog = debug("app");

if (process.env.NODE_ENV !== "test") {
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize()
      ),
      meta: false,
    })
  );
}

app.use(express.json());
app.use(cors());

app.use("/api/books", booksRouter);
app.use("/api/authors", authorsRouter);

app.use((req, res, next) => {
  next(createError(404, "No, can do"));
});

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  debugLog("Error status:", err.status);
  debugLog("Error message:", err.message);
  debugLog("Error stack:", err.stack);
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
    stack: err.stack?.split("\n"),
  });
};
app.use(errorHandler);

const server = () => {
  // fix for: "Jest has detected the following 1 open handle potentially keeping Jest from exiting"
  if (process.env.NODE_ENV === "test") return;

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    debugLog(`\nListening on port http://localhost:${PORT}`);
  });
  return server;
};

export default server();
export { app };
