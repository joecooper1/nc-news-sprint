const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteComment
} = require("../controllers/comments-controllers");
const { methodDisallowed } = require("../controllers/api-controllers");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(methodDisallowed);

module.exports = { commentsRouter };
