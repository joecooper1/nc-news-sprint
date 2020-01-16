const {
  getArticle,
  patchArticles,
  postComment,
  getComments,
  getArticles
} = require("../controllers/articles-controller");
const { methodDisallowed } = require("../controllers/api-controllers");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticles)
  .all(methodDisallowed);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(methodDisallowed);

articlesRouter
  .route("/")
  .get(getArticles)
  .all(methodDisallowed);

module.exports = { articlesRouter };
