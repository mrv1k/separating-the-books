import supertest from "supertest";

import { app } from "../app";

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
    test("it works", () => {
      expect(true).toBe(true);
    });

    // test("gets", async () => {
    //   const res = await request.get("/");

    //   expect(res.text).toBe("yes");
    // });

    test.todo("rewrite to work with mongo");
    //   test("GET returns all books", async () => {
    //     const booksRes = await request
    //       .get("/api/books")
    //       .expect("Content-Type", /json/)
    //       .expect(200, inMemoryDB);

    //     expect(booksRes.body).toMatchObject(inMemoryDB);
    //   });

    //   test("POST create a new book", async () => {
    //     const newBook = { title: "Wawawewa" };
    //     await request.post("/api/books").send(newBook).expect(201);
    //     expect(inMemoryDB).toContainEqual(expect.objectContaining(newBook));
    //   });
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
