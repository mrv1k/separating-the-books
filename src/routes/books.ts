import { Router } from "express";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { wrap } from "../utils/express-helpers";
import BooksController from "../controllers/books";

const router = Router();

const validation: RequestHandler = (req, res, next) => {
  const { title } = req.body;

  if (typeof title === "undefined") {
    return res.status(400).json({ error: "Parameter 'title' is required" });
  } else if (title === "") {
    return res.status(422).json({ error: "Parameter 'title' is invalid" });
  }
  res.locals.title = title;
  next();
};

router
  .route("/")
  .get(wrap(BooksController.getAll))
  .post(validation, wrap(BooksController.createOne));

router.param("id", (req, res, next, id) => {
  if (!isValidObjectId(id)) next();
  res.locals._id = id;
  next();
});

router
  .route("/:id")
  .get(wrap(BooksController.getOneById))
  .put(validation, wrap(BooksController.completeUpdateOrCreateOneById))
  .patch(validation, wrap(BooksController.partialUpdateOneById))
  .delete(wrap(BooksController.deleteOneById));

export default router;
