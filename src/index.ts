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
