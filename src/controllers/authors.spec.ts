/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import TestDB from "../loaders/test-mongoose";
import AuthorModel, { Author } from "../models/author";
import AuthorsController from "./authors";

describe("controllers/authors", () => {
  let db: TestDB;
  let reqStub: Request;
  let resStub: Response;

  beforeAll(async () => {
    db = new TestDB();
    await db.start();
  });
  beforeEach(async () => {
    reqStub = {} as Request;
    resStub = { json: (body) => body } as Response;
  });
  afterEach(async () => await db.cleanup());
  afterAll(async () => await db.stop());

  it("gets many authors", async () => {
    const payload: Author[] = [
      { first_name: "first_name", last_name: "last_name" },
      { first_name: "Borat", last_name: "Sagdiyev" },
    ];
    await AuthorModel.create(payload);

    const response = await AuthorsController.getMany(reqStub, resStub);

    expect(response).toHaveLength(payload.length);
    expect(response).toMatchObject(payload);
  });

  it.skip("should get 1 author by id", async () => {
    const payload: Author = {
      first_name: "first_name",
      last_name: "last_name",
    };

    await AuthorModel.create(payload);

    const count = await AuthorModel.estimatedDocumentCount();
    expect(count).toEqual(1);
  });
});
