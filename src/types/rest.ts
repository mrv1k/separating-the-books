// https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design#define-operations-in-terms-of-http-methods
import { NextFunction, Request, Response } from "express";

export interface REST {
  postOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  getOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  putOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  patchOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  deleteOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;

  getMany(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
}
