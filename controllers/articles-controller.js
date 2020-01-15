const {
  selectArticle,
  updateArticles,
  insertComment,
  selectComments,
  selectArticles
} = require("../models/articles-models");

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};

const patchArticles = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticles(article_id, inc_votes)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  insertComment(article_id, body, username)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  selectComments(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

const getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};

module.exports = {
  getArticle,
  patchArticles,
  postComment,
  getComments,
  getArticles
};
