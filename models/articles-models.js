const connection = require("../db/connection");
const { checkSecondary, countTotalArticles } = require("./models-utils/utils");

const selectArticle = article_id => {
  return connection("articles")
    .first(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comment_id as comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(article => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article;
    });
};

const updateArticles = (article_id, inc_votes = 0) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else return article[0];
    });
};

const insertComment = (article_id, body, username) => {
  if (body === undefined) {
    return Promise.reject({ status: 400, msg: "Cannot post empty comment!" });
  } else if (username === undefined) {
    return Promise.reject({ status: 400, msg: "Must specify username!" });
  }
  return connection("comments")
    .insert({ author: username, article_id, body })
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else return comment[0];
    });
};

const selectComments = (article_id, sort_by, order, limit = 10, p) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: "Order must be 'asc' or 'desc'"
    });
  }
  if (+p < 1) {
    return Promise.reject({
      status: 400,
      msg: "Page cannot be less than one"
    });
  }
  if (
    +limit === NaN ||
    (p !== undefined && +p === NaN) ||
    (p !== undefined && +p !== Math.floor(+p)) ||
    (+limit !== NaN && +limit !== Math.floor(+limit))
  ) {
    return Promise.reject({
      status: 400,
      msg: "Number must be a valid integer"
    });
  }
  return connection("articles")
    .select("*")
    .where("article_id", article_id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else
        return connection("comments")
          .select("comment_id", "votes", "created_at", "author", "body")
          .where("article_id", article_id)
          .orderBy(sort_by || "created_at", order || "desc")
          .limit(limit)
          .modify(queryString => {
            if (p !== undefined && p > 1) queryString.offset(limit * (p - 1));
          });
    });
};

const selectArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  limit = 10,
  p
}) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({
      status: 400,
      msg: "Order must be 'asc' or 'desc'"
    });
  }
  if (+p < 1) {
    return Promise.reject({
      status: 400,
      msg: "Page cannot be less than one"
    });
  }
  if (
    +limit === NaN ||
    (p !== undefined && +p === NaN) ||
    (p !== undefined && +p !== Math.floor(+p)) ||
    (+limit !== NaN && +limit !== Math.floor(+limit))
  ) {
    return Promise.reject({
      status: 400,
      msg: "Number must be a valid integer"
    });
  }
  return connection("articles")
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .modify(queryString => {
      if (author) queryString.where("articles.author", author);
      if (topic) queryString.where("topic", topic);
      if (p !== undefined && p > 1) queryString.offset(limit * (p - 1));
    })
    .orderBy(sort_by, order)
    .count("comment_id as comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .limit(limit)
    .then(articles => {
      if (articles.length === 0) {
        if (author) {
          return checkSecondary("users", "username", author, p);
        }
        if (topic) {
          return checkSecondary("topics", "slug", topic, p);
        }
      }
      // articles.forEach(article => {
      //   article.comment_count = Number(article.comment_count);
      // });
      return countTotalArticles(articles, author, topic, p);
    });
};

const insertArticle = body => {
  return connection("articles")
    .insert(body)
    .returning("*");
};

module.exports = {
  selectArticle,
  updateArticles,
  insertComment,
  selectComments,
  selectArticles,
  insertArticle
};
