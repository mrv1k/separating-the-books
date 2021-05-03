import { RequestHandler, RequestParamHandler } from "express";
import createError from "http-errors";
import { isValidObjectId } from "mongoose";

export const validateId: RequestParamHandler = (req, res, next, id) => {
  if (!isValidObjectId(id)) {
    throw Error("ID is invalid");
  }
  res.locals._id = id;
  next();
};

export const methodNotAllowed: RequestHandler = (req, res) => {
  res.status(405).json(new createError.MethodNotAllowed());
};
