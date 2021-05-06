import cors from "cors";
import debug from "debug";
import express, { Application, ErrorRequestHandler } from "express";
import expressWinston from "express-winston";
import createError from "http-errors";
import winston from "winston";

// import authorsRouter from "@/routes/authors";
import booksRouter from "@/routes/books";

export default (app: Application): Application => {
  app.use(express.json());
  app.use(cors());

  app.use("/api/books", booksRouter);
  // app.use("/api/authors", authorsRouter);

  app.use((req, res, next) => {
    next(createError(404, "No, can do"));
  });

  const debugLog = debug("app");
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

  if (process.env.NODE_ENV !== "test") useLogger(app);

  return app;
};

function useLogger(app: Application) {
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
