import TestDB from "../loaders/test-mongoose";
import AuthorModel, { Author } from "../models/author";

describe("controllers/authors", () => {
  let db: TestDB;

  beforeAll(async () => {
    db = new TestDB();
    await db.start();
  });

  afterAll(async () => {
    await db.stop();
  });

  it("gets many authors", async () => {
    const rawAuthors: Author[] = [
      { first_name: "first_name", last_name: "last_name" },
      { first_name: "Borat", last_name: "Sagdiyev" },
    ];

    await AuthorModel.create(rawAuthors);

    const count = await AuthorModel.estimatedDocumentCount();
    expect(count).toEqual(2);
  });
});
