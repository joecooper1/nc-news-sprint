const connection = require("../../db/connection");

function checkSecondary(table, column, value, p) {
  return connection(table)
    .select("*")
    .where(column, value)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found"
        });
      } else {
        if (p > 1) {
          return Promise.reject({ status: 404, msg: "Page does not exist" });
        }
        return { articles: [], total_count: 0 };
      }
    });
}

function countTotalArticles(articles, author, topic, p, title) {
  return connection("articles")
    .select("*")
    .modify(queryString => {
      if (topic) queryString.where("topic", topic);
      if (author) queryString.where("author", author);
      if (title) queryString.where("title", "ilike", "%" + title + "%");
    })
    .then(allArticles => {
      const total_count = allArticles.length;
      if (
        (p > 1 && p > Math.ceil(total_count / articles.length)) ||
        articles.length === 0
      ) {
        return Promise.reject({ status: 404, msg: "Page does not exist" });
      }
      return { articles, total_count };
    });
}

module.exports = { checkSecondary, countTotalArticles };
