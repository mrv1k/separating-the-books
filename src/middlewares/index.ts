import { RequestHandler } from "express";
import createError from "http-errors";

export const methodNotAllowed: RequestHandler = (req, res) => {
  res.status(405).json(new createError.MethodNotAllowed());
};
