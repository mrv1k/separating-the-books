import { Router } from "express";
import { RequestHandler } from "express";
import {
  inMemoryDB,
  getBookById,
  InMemoryBook,
  InMemoryBookPayload,
} from "../in-memory-db";

import createError from "http-errors";
import { isValidObjectId } from "mongoose";
import Book from "../models/book";

const router = Router();

const bookPayloadValidation: RequestHandler = (req, res, next) => {
  const { title }: InMemoryBookPayload = req.body;

  if (typeof title === "undefined") {
    return res.status(400).json({ error: "Parameter 'title' is required" });
  } else if (title === "") {
    return res.status(422).json({ error: "Parameter 'title' is invalid" });
  }
  res.locals.title = title;
  next();
};

router
  .route("/")
  .get(async (_req, res) => {
    const books = await Book.find({}, "-_id authors title pageCount")
      .populate("authors", "-_id first_name last_name")
      .exec();

    res.send(books);
  })
  .post(bookPayloadValidation, async (req, res, next) => {
    const filter = { title: res.locals.title };
    const book = await Book.findOneAndUpdate(
      filter,
      {},
      { returnOriginal: false, upsert: true, rawResult: true }
    );

    if (book.ok && book.value) {
      const existed: boolean = book.lastErrorObject.updatedExisting;
      const id: string = book.value._id;

      const url = `${req.originalUrl}/${id}`;
      // console.log();
      // console.log(book.value);
      // console.log(url);
      // TODO: setting header breaks 303 response
      return (
        res
          // .location(url)
          .status(existed ? 303 : 201)
          .json({ id })
      );
    }

    next();
  });

router.param("id", async (req, res, next, id) => {
  if (!isValidObjectId(id)) {
    return res.send(createError(400, "temporary, incorrect id"));
  }

  const book = await Book.findById(id);
  if (book === null) return next("route");
  res.locals.book = book;
  next();
});

router
  .route("/:id")
  .get((req, res) => {
    res.send(res.locals.book);
  })
  .put(bookPayloadValidation, (req, res) => {
    const { book, title } = res.locals;
    // TODO: add response when object was already updated
    const updatedBook = Object.assign({}, book, { title });
    inMemoryDB[Number(res.locals.book.id)] = updatedBook;

    res.json({ url: req.url });
  });
// .delete((req, res) => {
//   inMemoryDB = inMemoryDB.filter((book) => book.id !== res.locals.book.id);
//   res.status(204).json(res.locals.book);
// });

export default router;
