import { Router } from "express";

import AuthorsController from "@/controllers/authors";
import { validateId } from "@/middlewares";
import { methodNotAllowed, wrap } from "@/utils/express-helpers";

const router = Router();

router
  .route("/")
  .get(wrap(AuthorsController.getMany))
  .post(wrap(AuthorsController.postOne))
  .put(methodNotAllowed)
  .patch(methodNotAllowed)
  .delete(methodNotAllowed);

router.param("id", validateId);

router
  .route("/:id")
  .get(wrap(AuthorsController.getOne))
  .post(methodNotAllowed)
  .put(wrap(AuthorsController.putOne))
  .patch(wrap(AuthorsController.patchOne))
  .delete(wrap(AuthorsController.deleteOne));

export default router;
