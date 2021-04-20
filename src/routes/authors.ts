import { Router } from "express";
import { wrap } from "../utils/express-helpers";
import AuthorsController from "../controllers/authors";

const router = Router();

router.route("/").get(wrap(AuthorsController.getAll));

export default router;
