import { NextFunction, Request, Response } from "express";

class AuthorsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    res.json({ authors: "yay" });
  }
}

export default new AuthorsController();
