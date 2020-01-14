const {
  getArticle,
  patchArticles,
  postComment,
  getComments,
  getArticles
} = require("../controllers/articles-controller");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticles);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments);

articlesRouter.route("/").get(getArticles);

module.exports = { articlesRouter };
