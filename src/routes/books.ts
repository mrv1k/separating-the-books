import { Router } from "express";
import { RequestHandler } from "express";

import { isValidObjectId } from "mongoose";
import BookModel from "../models/book";

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
    const books = await BookModel.find({}, { _id: 0, __v: 0 })
      .lean()
      .populate("authors", { _id: 0, __v: 0 })
      .exec();

    res.send(books);
  })
  .post(bookPayloadValidation, async (req, res, next) => {
    const filter = { title: res.locals.title };
    const rawBook = await BookModel.findOneAndUpdate(
      filter,
      {},
      { returnOriginal: false, upsert: true, rawResult: true }
    );

    if (rawBook.ok !== 1 || typeof rawBook.value === "undefined") {
      return next("route");
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
  if (!isValidObjectId(id)) next("route");
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
      res.json(book);
    })
  )
  .put(
    wrap(async (req, res, next) => {
      res.send("tbd");
    })
  )
  .patch(
    wrap(async (req, res, next) => {
      res.send("tbd");
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
// GET /tickets - Retrieves a list of tickets
// GET /tickets/12 - Retrieves a specific ticket
// POST /tickets - Creates a new ticket
// PUT /tickets/12 - Updates ticket #12
// PATCH /tickets/12 - Partially updates ticket #12
// DELETE /tickets/12 - Deletes ticket #12

// title, pageCount, authors, subtitle?
