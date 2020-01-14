const commentsRouter = require("express").Router();
const { patchComment } = require("../controllers/comments-controllers");

commentsRouter.route("/:comment_id").patch(patchComment);

module.exports = { commentsRouter };
