import supertest from "supertest";

import { app } from "../../app";
import TestDB from "../../loaders/test-mongoose";
import AuthorModel, { Author } from "../../models/author";

describe("/api/books", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let db: TestDB;

  beforeAll(async () => {
    db = new TestDB();
    await db.start();
    request = supertest(app);
  });
  beforeEach(async () => {
    await db.cleanup();
  });
  afterAll(async () => {
    await db.stop();
  });

  describe("GET /api/authors", () => {
    test("responds 200 { authors }", async () => {
      const rawAuthors: Author[] = [
        { first_name: "first_name", last_name: "last_name" },
        { first_name: "Borat", last_name: "Sagdiyev" },
      ];
      await AuthorModel.create(rawAuthors);

      const response = await request.get("/api/authors").expect(200);

      expect(response.body).toMatchObject(rawAuthors);
    });
  });
});
