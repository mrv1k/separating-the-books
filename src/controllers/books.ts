import { NextFunction, Request, Response } from "express";

import BookModel from "@/models/book";
import { REST } from "@/types";
import { createLocationUrl } from "@/utils/express-helpers";

class BooksController implements REST {
  async getMany(req: Request, res: Response) {
    const books = await BookModel.find({}, { __v: 0 })
      .lean()
      .populate("authors", { __v: 0 });

    res.send(books);
  }

  async postOne(req: Request, res: Response, next: NextFunction) {
    const filter = { title: res.locals.title };
    const rawBook = await BookModel.findOneAndUpdate(
      filter,
      {},
      { upsert: true, new: true, rawResult: true, projection: { __v: 0 } }
    );

    if (rawBook.ok !== 1 || typeof rawBook.value === "undefined") {
      return next();
    }

    const existed: boolean = rawBook.lastErrorObject.updatedExisting;
    const book = rawBook.value;

    const location = createLocationUrl(req, book._id);
    res.location(location.absolute);

    if (existed) {
      return res.status(409).json({
        error: "Resource already exists",
        location: location.relative,
      });
    }

    return res.status(201).json(book);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const book = await BookModel.findById(res.locals._id, { __v: 0 })
      .lean()
      .populate("authors", { __v: 0 });

    if (book === null) return next();
    res.json(book);
  }

  async putOne(req: Request, res: Response, next: NextFunction) {
    const update = { title: res.locals.title };
    const rawBook = await BookModel.findByIdAndUpdate(res.locals._id, update, {
      upsert: true,
      rawResult: true,
      returnOriginal: false,
    }).populate("authors");

    if (rawBook.ok !== 1 || typeof rawBook.value === "undefined") {
      return next();
    }

    const existed: boolean = rawBook.lastErrorObject.updatedExisting;
    const book = rawBook.value;
    book.__v = undefined;
    console.log(book.authors);

    if (!existed) res.status(201);

    res.json(book);
  }

  async patchOne(req: Request, res: Response, next: NextFunction) {
    const { title, _id } = res.locals;
    const update = { title };
    const book = await BookModel.updateOne({ _id }, update);

    if (book.nModified === 0) {
      return res.status(204).json();
    }
    res.json({ patched: update });
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const book = await BookModel.findByIdAndDelete(res.locals._id);

    if (book === null) {
      return res.status(204).json();
    }
    res.json(book);
  }
}

export default new BooksController();
