import { NextFunction, Request, RequestHandler, Response } from "express";
import createError from "http-errors";
import { Types } from "mongoose";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function wrap(fn: any): any {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}

export const methodNotAllowed: RequestHandler = (req, res) => {
  res.status(405).json(new createError.MethodNotAllowed());
};

interface LocationUrls {
  relative: string;
  absolute: string;
}
export function createLocationUrl(
  req: Request,
  _id: Types.ObjectId
): LocationUrls {
  const relative = `${req.baseUrl}/${_id}`;
  const absolute = `${req.protocol}://${req.get("host")}${relative}`;
  return { relative, absolute };
}
