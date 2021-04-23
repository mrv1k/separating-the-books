import { NextFunction, Request, Response } from "express";
import AuthorModel, { Author } from "@/models/author";
import { createLocationUrl } from "@/utils/express-helpers";
import { REST } from "@/types/rest";

class AuthorsController implements REST {
  async getMany(req: Request, res: Response) {
    const authors = await AuthorModel.find().lean();

    res.json(authors);
  }

  async postOne(req: Request, res: Response, next: NextFunction) {
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
      const location = createLocationUrl(req, existingAuthor._id);
      res.location(location.absolute);

      return res.status(409).json({
        error: "Resource already exists",
        location: location.relative,
      });
    }

    const author = await new AuthorModel(payload).save({
      validateBeforeSave: false, // validated above
    });

    res.location(createLocationUrl(req, author._id).absolute).json(author);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    res.send("wip");
  }

  async putOne(req: Request, res: Response, next: NextFunction) {
    res.send("wip");
  }

  async patchOne(req: Request, res: Response, next: NextFunction) {
    res.send("wip");
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    res.send("wip");
  }
}

export default new AuthorsController();
