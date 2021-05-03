import { RequestHandler, Router } from "express";

import BooksController from "@/controllers/books";
import { validateId } from "@/middlewares";
import { methodNotAllowed, wrap } from "@/utils/express-helpers";

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
  .get(wrap(BooksController.getMany))
  .post(validation, wrap(BooksController.postOne))
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.param("id", validateId);

router
  .route("/:id")
  .get(wrap(BooksController.getOne))
  .post(methodNotAllowed)
  .put(validation, wrap(BooksController.putOne))
  .patch(validation, wrap(BooksController.patchOne))
  .delete(wrap(BooksController.deleteOne));

export default router;
