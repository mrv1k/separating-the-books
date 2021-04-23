import { Router } from "express";

import AuthorsController from "@/controllers/authors";
import { wrap } from "@/utils/express-helpers";

const router = Router();

router
  .route("/")
  .get(wrap(AuthorsController.getMany))
  .post(wrap(AuthorsController.postOne));

export default router;
