const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);

  return Promise.all([topicsInsertions, usersInsertions])
    .then(() => {
      const formattedArticles = formatDates(articleData);
      console.log(formattedArticles);
      return knex("articles")
        .insert(formattedArticles)
        .returning("*");
    })
    .then(articleRows => {
      const articlesRefObj = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articlesRefObj);
      console.log(formattedComments);
      return knex("comments").insert(formattedComments);
    });
};
