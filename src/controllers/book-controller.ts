import { RequestHandler } from "express";
import BookModel from "../models/book";

export const getAll: RequestHandler = async (req, res) => {
  const books = await BookModel.find({}, { _id: 0, __v: 0 })
    .lean()
    .populate("authors", { _id: 0, __v: 0 })
    .exec();

  res.send(books);
};

export const createOne: RequestHandler = async (req, res, next) => {
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
};

export const getOneById: RequestHandler = async (req, res, next) => {
  const book = await BookModel.findById(res.locals.id, { __v: 0 })
    .lean()
    .populate("authors", { __v: 0 });

  if (book === null) return next();
  res.json(book);
};

export const completeUpdateOrCreateById: RequestHandler = async (
  req,
  res,
  next
) => {
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
};

export const partialUpdateById: RequestHandler = async (req, res, next) => {
  const update = { title: res.locals.title };
  const book = await BookModel.updateOne({ _id: res.locals.id }, update);

  if (book.nModified === 0) {
    return res.status(204).json();
  }
  res.json({ patched: update });
};

export const deleteOneById: RequestHandler = async (req, res, next) => {
  const filter = { _id: res.locals.id };
  const book = await BookModel.findOneAndDelete(filter, {
    projection: { __v: 0 },
  });

  if (book === null) {
    return res.status(204).json();
  }
  res.json(book);
};
