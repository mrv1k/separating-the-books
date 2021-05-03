import supertest from "supertest";

import { app } from "../app";
import TestDB from "../loaders/test-mongoose";
import BookModel, { Book } from "../models/book";

/** @name supertest https://github.com/visionmedia/supertest#api
 * @function .expect(status[,fn]) - Assert response status code.
 * @function .expect(status,body[,fn]) - Assert response status code and body.
 * @function .expect(body[,fn]) - Assert response body text with a string, regular expression, or parsed body object.
 * @function .expect(field,value[,fn]) - Assert header field value with a string or regular expression.
 * @function .expect(function(res)) - Pass a custom assertion function. It'll be given the response object to check. If the check fails, throw an error
 */

describe("/api/books", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let db: TestDB;

  beforeAll(async () => {
    db = new TestDB();
    await db.start();
    request = supertest(app);
  });

  afterAll(async () => {
    await db.stop();
  });

  describe("/", () => {
    test("GET returns all books", async () => {
      return request
        .get("/api/books")
        .expect("Content-Type", /json/)
        .expect(200, []);
    });

    test("POST create a new book", async () => {
      const payload: Book = { title: "Title", pageCount: 100, authors: [] };
      await request.post("/api/books").send(payload).expect(201);

      const count = await BookModel.estimatedDocumentCount();
      expect(count).toEqual(1);

      const book = await BookModel.findOne({ title: payload.title }).lean();
      expect(book).not.toBeNull();

      // expect(book).toMatchObject(payload);
    });
  });

  describe("/:id", () => {
    test.todo("rewrite to work with mongo");
    //   test("GET returns 1 book", async () => {
    //     const dbFirstBook = inMemoryDB[0];
    //     const response = await request.get("/api/books/0");
    //     expect(response.body).toStrictEqual(dbFirstBook);
    //   });
    //   test("GET gives 404 on unknown id", async () => {
    //     await request.get("/api/books/wrong_id").expect(404);
    //   });
    //   it.todo("PUT");
    //   it.todo("DELETE");
  });
});
