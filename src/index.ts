import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

interface Book {
  title: string;
  id: string;
}

let db: Book[] = [{ title: "Sundering", id: "0" }];

function getOne(id: string) {
  return db.find((book) => book.id === id) || false;
}

app
  .route("/")
  .get((_req, res) => {
    res.send(db);
  })
  .post((req, res) => {
    // returns HTTP status code 201 (Created).
    // The URI of the new resource is included in the Location header of the response.
    // the response body contains a representation of the resource.
    const { body }: { body: { title?: string } } = req;

    if (!body.title || body.title === "") {
      return res.status(422).send("Parameter 'title' is required.");
    }

    const book: Book = {
      title: body.title,
      id: db.length.toString(),
    };

    db.push(book);
    res.status(201).send(db);
  });

app.param("id", (req, res, next, id) => {
  const book = getOne(id);
  if (!book) return next("route");
  res.locals.book = book;
  next();
});

app
  .route("/:id")
  .get((req, res) => {
    res.send(res.locals.book);
  })
  .put((req, res) => {
    const {
      body: { title },
    }: { body: { title?: string } } = req;

    if (!title || title === "") {
      return res.status(422).send("Parameter 'title' is required.");
    }

    // TODO: add response when object was already updated
    const updatedBook = Object.assign({}, res.locals.book, { title });
    db[Number(res.locals.book.id)] = updatedBook;

    res.json({ url: req.url });
  })
  .delete((req, res) => {
    db = db.filter((book) => book.id !== res.locals.book.id);
    res.status(204).json(res.locals.book);
  });

app.use((req, res) => {
  res.status(404);
  res.json({ error: "No, can do" });
});

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
