import { Router } from "express";

import AuthorsController from "@/controllers/authors";
import { validateId } from "@/middlewares";
import { wrap } from "@/utils/express-helpers";

const router = Router();

router
  .route("/")
  .get(wrap(AuthorsController.getMany))
  .post(wrap(AuthorsController.postOne));

router.param("id", validateId);

router
  .route("/:id")
  .get(wrap(AuthorsController.getOne))
  .put(wrap(AuthorsController.putOne))
  .delete(wrap(AuthorsController.deleteOne));

export default router;
