import supertest from "supertest";
import { app } from "../app";
import { db } from "../db";

describe("/api/books", () => {
  it("returns all books on GET /", async () => {
    const booksRes = await supertest(app)
      .get("/api/books")
      .expect("Content-Type", /json/)
      .expect(200, db);

    expect(booksRes.body).toMatchObject(db);
  });

  it("creates a book on POST /", async () => {
    const newBook = { title: "Wawawewa" };

    const booksRes = await supertest(app)
      .post("/api/books")
      .send(newBook)
      .expect(201);

    expect(db).toContainEqual(expect.objectContaining(newBook));
  });
});
