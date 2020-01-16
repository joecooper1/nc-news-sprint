const connection = require("../db/connection");

const selectTopics = () => {
  return connection("topics").select("*");
};

const insertTopic = body => {
  return connection("topics")
    .insert(body)
    .returning("*");
};

module.exports = { selectTopics, insertTopic };
