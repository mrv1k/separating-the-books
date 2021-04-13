import express, { RequestHandler } from "express";
import cors from "cors";
import { db, getBookById, Book, BookPayload } from "./db";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const bookPayloadValidation: RequestHandler = (req, res, next) => {
  const { title }: BookPayload = req.body;

  if (typeof title === "undefined") {
    return res.status(400).json({ error: "Parameter 'title' is required" });
  } else if (title === "") {
    return res.status(422).json({ error: "Parameter 'title' is invalid" });
  }
  res.locals.title = title;
  next();
};

app
  .route("/")
  .get((_req, res) => {
    res.send(db);
  })
  .post(bookPayloadValidation, (req, res) => {
    // returns HTTP status code 201 (Created).
    // The URI of the new resource is included in the Location header of the response.
    // the response body contains a representation of the resource.
    const book: Book = {
      title: res.locals.title,
      id: db.length.toString(),
    };

    db.push(book);
    res.status(201).send(db);
  });

app.param("id", (req, res, next, id) => {
  const book = getBookById(id);
  if (!book) return next("route");
  res.locals.book = book;
  next();
});

app
  .route("/:id")
  .get((req, res) => {
    res.send(res.locals.book);
  })
  .put(bookPayloadValidation, (req, res) => {
    const { book, title } = res.locals;
    // TODO: add response when object was already updated
    const updatedBook = Object.assign({}, book, { title });
    db[Number(res.locals.book.id)] = updatedBook;

    res.json({ url: req.url });
  });
// .delete((req, res) => {
//   db = db.filter((book) => book.id !== res.locals.book.id);
//   res.status(204).json(res.locals.book);
// });

app.use((req, res) => {
  res.status(404);
  res.json({ error: "No, can do" });
});

// app.listen(PORT, () => {
//   console.log(`Listening on port http://localhost:${PORT}`);
// });

export default app;
