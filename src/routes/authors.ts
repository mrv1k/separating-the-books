// import { Router } from "express";

// import AuthorsController from "@/controllers/authors";
// import { methodNotAllowed, validateId } from "@/middlewares";
// import { wrap } from "@/utils/express-helpers";

// const router = Router();

// router
//   .route("/")
//   .post(wrap(AuthorsController.postOne))
//   .get(wrap(AuthorsController.getMany))
//   .put(methodNotAllowed)
//   .patch(methodNotAllowed)
//   .delete(methodNotAllowed);

// router.param("id", validateId);

// router
//   .route("/:id")
//   .post(methodNotAllowed)
//   .get(wrap(AuthorsController.getOne))
//   .put(wrap(AuthorsController.putOne))
//   .patch(wrap(AuthorsController.patchOne))
//   .delete(wrap(AuthorsController.deleteOne));

// export default router;
