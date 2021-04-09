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

const db: Book[] = [{ title: "Sundering", id: "0" }];
function getOne({ id }: { id: string }) {
  return db.find((book) => book.id == id);
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

app.put("/:id", (req, res) => {
  console.log("put");
});

app.delete("/:id", (req, res) => {
  console.log("delete");
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  const result = getOne({ id });
  if (!result) res.status(404);
  res.json(result);
});

/**
 * CRUD
 * CREATE - POST
 * READ - GET
 * UPDATE - PUT
 * DELETE - DELETE
 */

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
