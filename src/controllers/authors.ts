import { NextFunction, Request, Response } from "express";
import Author from "../models/author";

class AuthorsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    const authors = await Author.find().lean();

    res.json(authors);
  }
}

export default new AuthorsController();
