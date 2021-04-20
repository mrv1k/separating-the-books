import { Router } from "express";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { wrap } from "../utils/express-helpers";

import {
  getAll,
  createOne,
  getOneById,
  completeUpdateOrCreateById,
  partialUpdateById,
  deleteOneById,
} from "../controllers/book-controller";

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

router.route("/").get(wrap(getAll)).post(validation, wrap(createOne));

router.param("id", (req, res, next, id) => {
  if (!isValidObjectId(id)) next();
  res.locals.id = id;
  next();
});

router
  .route("/:id")
  .get(wrap(getOneById))
  .put(validation, wrap(completeUpdateOrCreateById))
  .patch(validation, wrap(partialUpdateById))
  .delete(wrap(deleteOneById));

export default router;
