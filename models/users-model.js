const connection = require("../db/connection");

const selectUsers = (username = "%") => {
  return connection("users")
    .select("*")
    .where("username", "like", username);
};

module.exports = { selectUsers };
