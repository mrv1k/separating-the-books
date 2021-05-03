import { Router } from "express";

import BooksController from "@/controllers/books";
import { methodNotAllowed, validateId } from "@/middlewares";
import { wrap } from "@/utils/express-helpers";

const router = Router();

router
  .route("/")
  .post(wrap(BooksController.postOne))
  .get(wrap(BooksController.getMany))
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.param("id", validateId);

router
  .route("/:id")
  .post(methodNotAllowed)
  .get(wrap(BooksController.getOne))
  .put(wrap(BooksController.putOne))
  .patch(wrap(BooksController.patchOne))
  .delete(wrap(BooksController.deleteOne));

export default router;
