import { NextFunction, Request, Response } from "express";

// https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design#define-operations-in-terms-of-http-methods
export interface REST {
  getMany(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  getOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  postOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  putOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  patchOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
  deleteOne(req: Request, res: Response, next?: NextFunction): Promise<unknown>;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      PORT?: string;
      MONGO_URI: string;
      MONGO_DB: string;
    }
  }
}
