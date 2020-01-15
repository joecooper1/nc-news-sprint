const connection = require("../db/connection");

const updateComment = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Update body incomplete" });
  }
  return connection("comments")
    .where("comment_id", comment_id)
    .update("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else return comment;
    });
};

const removeComment = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(count => {
      if (count === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

module.exports = { updateComment, removeComment };
