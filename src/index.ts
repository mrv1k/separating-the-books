import express from "express";
import { json } from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(json());
app.use(cors());

interface Book {
  title: string;
  id: string;
}

let db: Book[] = [{ title: "Sundering", id: "0" }];

function getOne({ id }: { id: string }) {
  return db.find((book) => book.id === id);
}

app.get("/", (_req, res) => {
  res.send(db);
});

app.post("/", (req, res) => {
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

app.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const result = getOne({ id });

  if (!result) return next();
  res.send(result);
});

app.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const result = getOne({ id });
  if (!result) return next();

  const {
    body: { title },
  }: { body: { title?: string } } = req;

  if (!title || title === "") {
    return res.status(422).send("Parameter 'title' is required.");
  }

  const updatedBook = Object.assign({}, result, { title });
  db[Number(id)] = updatedBook;

  res.json({ url: req.url });
});

app.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  const result = getOne({ id });
  if (!result) return next();

  console.log(db);
  db = db.filter((book) => book.id !== result.id);
  console.log(db);
  res.json(result);
});

app.use((req, res) => {
  res.status(404);
  res.json({ error: "No, can do" });
});

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
