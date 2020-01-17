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

const updateUser = ({ name, avatar_url }, params) => {
  return connection("users")
    .modify(queryString => {
      if (name) queryString.update({ name });
      if (avatar_url) queryString.update({ avatar_url });
      if (!name && !avatar_url) queryString.select("*");
    })
    .where("username", params.username)
    .returning("*")
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return user;
    });
};

module.exports = { selectUsers, insertUser, updateUser };
