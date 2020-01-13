const connection = require("../db/connection");

const selectUsers = () => {
  return connection("users").select("*");
};

module.exports = { selectUsers };
