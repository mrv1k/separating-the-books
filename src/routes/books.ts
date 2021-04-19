import { Router } from "express";
import { RequestHandler } from "express";

import { isValidObjectId } from "mongoose";
import Book from "../models/book";

const router = Router();

const bookPayloadValidation: RequestHandler = (req, res, next) => {
  const { title } = req.body;

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
    const books = await Book.find({}, { _id: 0, __v: 0 })
      .lean()
      .populate("authors", { _id: 0, __v: 0 })
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

      return res
        .location(`${req.originalUrl}/${id}`)
        .status(existed ? 303 : 201)
        .json({ id });
    }

    next();
  });

router.param("id", (req, res, next, id) => {
  if (!isValidObjectId(id)) next("route");
  res.locals.id = id;
  next();
});

router.route("/:id").get(
  asyncHandler(async (req, res, next) => {
    const book = await Book.findById(res.locals.id, {
      __v: 0,
    })
      .lean()
      .populate("authors", { __v: 0 });
    res.json(book);
  })
);
// .put(bookPayloadValidation, (req, res) => {
//   const { book, title } = res.locals;
//   const filter = { title: title };
// // TODO: add response when object was already updated
// const updatedBook = Object.assign({}, book, { title });
// inMemoryDB[Number(res.locals.book.id)] = updatedBook;

// res.json({ url: req.url });

// const book = Book.findOneAndUpdate(filter, book);
// });
// .delete((req, res) => {
//   inMemoryDB = inMemoryDB.filter((book) => book.id !== res.locals.book.id);
//   res.status(204).json(res.locals.book);
// });

export default router;

function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
// GET /tickets - Retrieves a list of tickets
// GET /tickets/12 - Retrieves a specific ticket
// POST /tickets - Creates a new ticket
// PUT /tickets/12 - Updates ticket #12
// PATCH /tickets/12 - Partially updates ticket #12
// DELETE /tickets/12 - Deletes ticket #12

// title, pageCount, authors, subtitle?
