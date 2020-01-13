const connection = require("../db/connection");

const selectTopics = () => {
  return connection("topics").select("*");
};

module.exports = { selectTopics };
