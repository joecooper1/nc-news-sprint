const {
  topicData,
  articleData,
  commentData,
  userData,
  favouriteData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticles = formatDates(articleData);
      return knex("articles")
        .insert(formattedArticles)
        .returning("*");
    })
    .then(articleRows => {
      const articlesRefObj = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articlesRefObj);
      const commentsInsertions = knex("comments").insert(formattedComments);
      const favouritesInsertions = knex("favourites").insert(favouriteData);
      return Promise.all([commentsInsertions, favouritesInsertions]);
    });
};
