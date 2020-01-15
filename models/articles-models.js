const connection = require("../db/connection");

const selectArticle = article_id => {
  return connection("articles")
    .select(
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
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      articles[0].comment_count = Number(articles[0].comment_count);
      return articles;
    });
};

const updateArticles = (article_id, inc_votes) => {
  return connection("articles")
    .where("article_id", article_id)
    .update("votes", inc_votes)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else return article;
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
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else return article;
    });
};

const selectComments = (article_id, sort_by, order) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: "Order must be 'asc' or 'desc'"
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
          .orderBy(sort_by || "comment_id", order || "asc");
    });
};

const selectArticles = ({ sort_by, order, author, topic }) => {
  if (order !== "asc" && order !== "desc" && order !== undefined) {
    return Promise.reject({
      status: 400,
      msg: "Order must be 'asc' or 'desc'"
    });
  }
  return connection("articles")
    .select("author", "title", "article_id", "topic", "created_at", "votes")
    .modify(queryString => {
      if (sort_by) queryString.orderBy(sort_by, order || "asc");
      if (author) queryString.where("author", author);
      if (topic) queryString.where("topic", topic);
    })
    .then(articles => {
      return connection("comments")
        .count()
        .then(result => {
          articles.forEach(
            article => (article.comment_count = Number(result[0].count))
          );
          return articles;
        });
    });
};

module.exports = {
  selectArticle,
  updateArticles,
  insertComment,
  selectComments,
  selectArticles
};
