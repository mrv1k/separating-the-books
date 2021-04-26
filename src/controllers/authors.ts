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
  async putOne(
    req: Request,
    res: Response<unknown, Record<string, unknown> & { _id: string }>,
    next: NextFunction
  ) {
    // ? Similar to POST logic
    const { _id } = res.locals;
    const payload: Author = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    console.log(payload);

    const author = await AuthorModel.findOne({
      $or: [{ _id: _id }, payload],
    });

    if (author === null) {
      const newAuthor = await AuthorModel.create(payload);
      return res.status(201).json(newAuthor);
    }

    // found by id
    if (author.id === _id) {
      author.first_name = payload.first_name;
      author.last_name = payload.last_name;
      await author.save();

      return res.json(author);
    }

    // found not by id, redirect
    const { absolute } = createLocationUrl(req, author.id);
    console.log("found by id, redirect");

    return res.location(absolute).status(303).end();
  }

  async patchOne(req: Request, res: Response, next: NextFunction) {
    const author = await AuthorModel.findById(res.locals._id);
    if (author === null) return res.status(404).end();

    const { first_name, last_name } = req.body;
    if (first_name) author.first_name = first_name;
    if (last_name) author.last_name = last_name;
    author.save();

    res.json(author);
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
