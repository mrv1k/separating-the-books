import supertest from "supertest";
import { app } from "../app";
import { db } from "../db";

/** @name supertest https://github.com/visionmedia/supertest#api
 * @function .expect(status[,fn]) - Assert response status code.
 * @function .expect(status,body[,fn]) - Assert response status code and body.
 * @function .expect(body[,fn]) - Assert response body text with a string, regular expression, or parsed body object.
 * @function .expect(field,value[,fn]) - Assert header field value with a string or regular expression.
 * @function .expect(function(res)) - Pass a custom assertion function. It'll be given the response object to check. If the check fails, throw an error
 */

describe("/api/books", () => {
  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(() => {
    request = supertest(app);
  });

  describe("/", () => {
    test("GET returns all books", async () => {
      const booksRes = await request
        .get("/api/books")
        .expect("Content-Type", /json/)
        .expect(200, db);

      expect(booksRes.body).toMatchObject(db);
    });

    test("POST create a new book", async () => {
      const newBook = { title: "Wawawewa" };

      await request.post("/api/books").send(newBook).expect(201);

      expect(db).toContainEqual(expect.objectContaining(newBook));
    });
  });

  describe("/:id", () => {
    it.todo("GET");
    it.todo("PUT");
    it.todo("DELETE");
  });
});
