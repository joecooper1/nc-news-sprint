const {
  selectArticle,
  updateArticles,
  insertComment,
  selectComments,
  selectArticles,
  insertArticle,
  removeArticle
} = require("../models/articles-models");

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

const patchArticles = (req, res, next) => {
  const { inc_votes, body } = req.body;
  const { article_id } = req.params;
  updateArticles(article_id, inc_votes, body)
    .then(article => {
      res.status(200).send({ article });
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
  const { sort_by, order, limit, p } = req.query;
  selectComments(article_id, sort_by, order, limit, p)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

const getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(err => next(err));
};

const postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(article => {
      res.status(201).send({ article: article[0] });
    })
    .catch(err => next(err));
};

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(count => {
      res.status(204).send();
    })
    .catch(err => next(err));
};

module.exports = {
  getArticle,
  patchArticles,
  postComment,
  getComments,
  getArticles,
  postArticle,
  deleteArticle
};
