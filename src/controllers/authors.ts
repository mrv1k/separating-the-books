import { NextFunction, Request, Response } from "express";

import AuthorModel, { Author } from "@/models/author";
import { REST } from "@/types";
import { createLocationUrl } from "@/utils/express-helpers";

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
    const author = await AuthorModel.findById(res.locals._id).lean().exec();

    if (!author) return next();
    res.json(author);
  }

  // 0. requires all fields to be present in response
  // 1. search for it,
  // 1.1 doesn't exist - create
  // 1.2 exists - update
  async putOne(req: Request, res: Response, next: NextFunction) {
    // ? Similar to POST logic
    const { _id }: { _id: string } = res.locals;
    const { first_name, last_name } = req.body;
    const payload: Author = { first_name, last_name };

    const author = await AuthorModel.findOne({
      $or: [{ _id: _id }, payload],
    });
    console.log(author);

    if (author === null) {
      // create
      console.log("fired");

      res.end();
      return;
    }

    if (author.id !== _id) {
      console.log(typeof author._id, typeof _id);

      console.log("found not by id", _id, author._id);
    }
    res.end();
    return;

    // author.first_name = payload.first_name;
    // author.last_name = payload.last_name;
    // await author.save();

    // res.json(author);
  }

  async patchOne(req: Request, res: Response, next: NextFunction) {
    res.send("wip");
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const author = await AuthorModel.findByIdAndDelete(res.locals._id);

    if (author === null) {
      return res.status(204).json();
    }

    res.json(author);
  }
}

export default new AuthorsController();
