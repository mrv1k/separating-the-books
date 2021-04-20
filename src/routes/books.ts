import { Router } from "express";
import { RequestHandler } from "express";

import { isValidObjectId } from "mongoose";
import BookModel from "../models/book";

const router = Router();

const validation: RequestHandler = (req, res, next) => {
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
    const books = await BookModel.find({}, { _id: 0, __v: 0 })
      .lean()
      .populate("authors", { _id: 0, __v: 0 })
      .exec();

    res.send(books);
  })
  .post(validation, async (req, res, next) => {
    const filter = { title: res.locals.title };
    const rawBook = await BookModel.findOneAndUpdate(
      filter,
      {},
      { returnOriginal: false, upsert: true, rawResult: true }
    );

    if (rawBook.ok !== 1 || typeof rawBook.value === "undefined") {
      return next();
    }

    const existed: boolean = rawBook.lastErrorObject.updatedExisting;
    const book = rawBook.value;
    book.__v = undefined;

    const relativeUrl = `${req.originalUrl}/${book._id}`;
    const absoluteUrl = `${req.protocol}://${req.get("host")}${relativeUrl}`;
    res.location(absoluteUrl);

    if (existed) {
      return res.status(409).json({
        error: "Resource already exists",
        location: relativeUrl,
      });
    }

    return res.status(201).json(book);
  });

router.param("id", (req, res, next, id) => {
  if (!isValidObjectId(id)) next();
  res.locals.id = id;
  next();
});

router
  .route("/:id")
  .get(
    wrap(async (req, res, next) => {
      const book = await BookModel.findById(res.locals.id, { __v: 0 })
        .lean()
        .populate("authors", { __v: 0 });

      if (book === null) return next();
      res.json(book);
    })
  )
  .put(
    validation,
    wrap(async (req, res, next) => {
      const update = { title: res.locals.title };
      const rawBook = await BookModel.findByIdAndUpdate(res.locals.id, update, {
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
    })
  )
  .patch(
    validation,
    wrap(async (req, res, next) => {
      const update = { title: res.locals.title };
      const book = await BookModel.updateOne({ _id: res.locals.id }, update);

      if (book.nModified === 0) {
        return res.status(204).json();
      }
      res.json({ patched: update });
    })
  )
  .delete(
    wrap(async (req, res, next) => {
      res.send("tbd");
    })
  );

export default router;

function wrap(fn: RequestHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
// PATCH /tickets/12 - Partially updates ticket #12
// DELETE /tickets/12 - Deletes ticket #12
