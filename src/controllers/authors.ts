import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { Author } from "@/entity/author";
// import { REST } from "@/types";
import { createLocationUrl } from "@/utils/express-helpers";

class AuthorsController {
  async getMany(req: Request, res: Response) {
    const repository = getRepository(Author);
    const authors = await repository.find();
    return res.json(authors);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const repository = getRepository(Author);
    const author = await repository.findOne(req.params.id);

    if (author === undefined) return next();
    return res.json(author);
  }

  async postOne(req: Request, res: Response, next: NextFunction) {
    const payload = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };
    const repository = getRepository(Author);

    const author = repository.create(payload);
    await repository.save(author);

    res.location(createLocationUrl(req, author.id).absolute).json(author);
  }

  // async putOne(req: Request, res: Response, next: NextFunction) {
  //   const _id = res.locals._id;
  //   const payload: Author = {
  //     first_name: req.body.first_name,
  //     last_name: req.body.last_name,
  //   };
  //   console.log(payload);

  //   const author = await AuthorModel.findOne({
  //     $or: [{ _id: _id }, payload],
  //   });

  //   if (author === null) {
  //     const newAuthor = await AuthorModel.create(payload);
  //     return res.status(201).json(newAuthor);
  //   }

  //   // found by id
  //   if (author.id === _id) {
  //     author.first_name = payload.first_name;
  //     author.last_name = payload.last_name;
  //     await author.save();

  //     return res.json(author);
  //   }

  //   // found not by id, redirect
  //   const { absolute } = createLocationUrl(req, author.id);
  //   console.log("found by id, redirect");

  //   return res.location(absolute).status(303).end();
  // }

  // async patchOne(req: Request, res: Response, next: NextFunction) {
  //   const author = await AuthorModel.findById(res.locals._id);
  //   if (author === null) return res.status(404).end();

  //   const { first_name, last_name } = req.body;
  //   if (first_name === author.first_name && last_name === author.last_name) {
  //     // already up to date
  //     return res.json(author);
  //   }

  //   if (first_name) author.first_name = first_name;
  //   if (last_name) author.last_name = last_name;
  //   author.save();

  //   res.json(author);
  // }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const repository = getRepository(Author);
    const deleteResult = await repository.delete(req.params.id);

    if (deleteResult.affected === 1) {
      return res.status(204).end();
    }

    next();
  }
}

export default new AuthorsController();
