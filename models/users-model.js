const connection = require("../db/connection");

const selectUsers = (username = "%") => {
  return connection("users")
    .select("*")
    .where("username", "like", username)
    .then(users => {
      if (users.length === 0)
        return Promise.reject({ status: 404, msg: "Not found" });
      else return users;
    });
};

const insertUser = body => {
  return connection("users")
    .insert(body)
    .returning("*");
};

module.exports = { selectUsers, insertUser };
