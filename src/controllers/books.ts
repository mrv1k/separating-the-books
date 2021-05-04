import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import AuthorModel, { Author } from "@/models/author";
import BookModel, { Book } from "@/models/book";
import { REST } from "@/types";
import { createLocationUrl } from "@/utils/express-helpers";

class BooksController implements REST {
  async getMany(req: Request, res: Response) {
    const books = await BookModel.find().lean().populate("authors");
    res.send(books);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const book = await BookModel.findById(res.locals._id)
      .lean()
      .populate("authors")
      .exec();

    if (book === null) return next();
    res.json(book);
  }

  async postOne(req: Request, res: Response, next: NextFunction) {
    // TODO: handle array of authors IDs
    // if (Array.isArray(req.body.authors) === false) {
    //   return res.status().json();
    // }

    // const author: Author = {
    //   first_name: req.body.first_name,
    //   last_name: req.body.last_name,
    // };

    // AuthorModel.validate(author);
    const authors: Author[] = [];

    const payload: Book = {
      title: req.body.title,
      pageCount: req.body.pageCount,
      authors,
    };

    try {
      await BookModel.validate(payload);
    } catch (validation) {
      return res.status(422).json({
        error: new createError.UnprocessableEntity(),
        validation,
      });
    }

    const existingBook = await BookModel.findOne(payload);
    if (existingBook) {
      const location = createLocationUrl(req, existingBook._id);
      return res.location(location.absolute).status(409).json({
        error: new createError.Conflict(),
        location: location.relative,
      });
    }

    // res.location(location.absolute);

    // if (existed) {
    //   return res.status(409).json({
    //     error: "Resource already exists",
    //     location: location.relative,
    //   });
    // }

    // return res.status(201).json(book);
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

    if (existed) {
      res.json(book);
    }

    res.status(201).json(book);
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
