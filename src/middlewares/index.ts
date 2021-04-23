import { RequestParamHandler } from "express";
import { isValidObjectId } from "mongoose";

export const validateId: RequestParamHandler = (req, res, next, id) => {
  if (!isValidObjectId(id)) {
    throw Error("ID is invalid");
  }
  res.locals._id = id;
  next();
};
