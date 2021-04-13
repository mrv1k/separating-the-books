import supertest from "supertest";
import { app } from "../app";
import { db } from "../db";

describe("/api/books", () => {
  it("GET /", async () => {
    const booksRes = await supertest(app)
      .get("/api/books")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(booksRes.body).toMatchObject(db);
  });
});
