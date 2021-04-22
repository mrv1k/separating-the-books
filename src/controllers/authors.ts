import { NextFunction, Request, Response } from "express";
import AuthorModel, { Author } from "../models/author";

class AuthorsController {
  async getAll(req: Request, res: Response) {
    const authors = await AuthorModel.find().lean();

    res.json(authors);
  }

  async createOne(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name } = req.body;
    const payload: Author = { first_name, last_name };
    // eslint-disable-next-line no-useless-catch
    try {
      await AuthorModel.validate(payload);
    } catch (error) {
      throw error;
    }

    // can't use .exists() - need object id for url, use equivalent
    const existingAuthor = await AuthorModel.findOne(payload, { _id: 1 })
      .lean()
      .exec();

    if (existingAuthor) {
      // ! copypaste from controllers/books
      const relativeUrl = `${req.originalUrl}/${existingAuthor._id}`;
      const absoluteUrl = `${req.protocol}://${req.get("host")}${relativeUrl}`;
      res.location(absoluteUrl);

      return res.status(409).json({
        error: "Resource already exists",
        location: relativeUrl,
      });
    }

    const author = await new AuthorModel(payload).save({
      validateBeforeSave: false, // validated above
    });

    // ! copypaste number 3, refactor
    const relativeUrl = `${req.originalUrl}/${author._id}`;
    const absoluteUrl = `${req.protocol}://${req.get("host")}${relativeUrl}`;
    res.location(absoluteUrl);

    res.json(author);
  }
}

export default new AuthorsController();
