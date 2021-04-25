import { Request, RequestHandler } from "express";
import { Types } from "mongoose";

export function wrap(fn: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

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
