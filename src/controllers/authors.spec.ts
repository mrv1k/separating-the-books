/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function  */
import { NextFunction, Request, Response } from "express";

import TestDB from "../loaders/test-mongoose";
import AuthorModel, { Author } from "../models/author";
import AuthorsController from "./authors";

describe("controllers/authors", () => {
  let db: TestDB;
  let req: Request;
  let res: Response;
  const next: NextFunction = () => {};

  beforeAll(async () => {
    db = new TestDB();
    await db.start();
  });
  beforeEach(async () => {
    await db.cleanup();
    req = {} as Request;
    res = { json: (body) => body } as Response;
  });
  afterAll(async () => await db.stop());

  it("gets many authors", async () => {
    const payload: Author[] = [
      { first_name: "first_name", last_name: "last_name" },
      { first_name: "Borat", last_name: "Sagdiyev" },
    ];
    await AuthorModel.create(payload);

    const response = await AuthorsController.getMany(req, res);

    expect(response).toHaveLength(payload.length);
    expect(response).toMatchObject(payload);
  });

  it("should get 1 author by id", async () => {
    const payload: Author = {
      first_name: "first_name",
      last_name: "last_name",
    };

    const author = await AuthorModel.create(payload);

    // stub mongo id validation middleware
    res.locals = { _id: author._id };
    const response = await AuthorsController.getOne(req, res, next);

    expect(response).toMatchObject(payload);
  });
});
