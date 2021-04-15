import { Router } from "express";
import { RequestHandler } from "express";
import {
  inMemoryDB,
  getBookById,
  InMemoryBook,
  InMemoryBookPayload,
} from "../in-memory-db";

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
  .get((_req, res) => {
    res.send(inMemoryDB);
  })
  .post(bookPayloadValidation, (req, res) => {
    // returns HTTP status code 201 (Created).
    // The URI of the new resource is included in the Location header of the response.
    // the response body contains a representation of the resource.
    const book: InMemoryBook = {
      title: res.locals.title,
      id: inMemoryDB.length.toString(),
    };

    inMemoryDB.push(book);
    res.status(201).send(inMemoryDB);
  });

router.param("id", (req, res, next, id) => {
  const book = getBookById(id);
  if (!book) return next("route");
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
