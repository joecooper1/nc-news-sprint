const connection = require("../db/connection");

const selectArticle = article_id => {
  return connection("articles")
    .select("*")
    .where("article_id", article_id)
    .then(articles => {
      return connection("comments")
        .count()
        .where("article_id", article_id)
        .then(result => {
          articles[0].comment_count = Number(result[0].count);
          return articles;
        });
    });
};

const updateArticles = (article_id, inc_votes) => {
  return connection("articles")
    .where("article_id", article_id)
    .update("votes", inc_votes)
    .returning("*");
};

const insertComment = (article_id, body, username) => {
  return connection("comments")
    .insert({ author: username, article_id, body })
    .returning("*");
};

const selectComments = (article_id, sort_by, order) => {
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(sort_by || "comment_id", order || "asc");
};

const selectArticles = ({ sort_by, order, author, topic }) => {
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
