const connection = require("../db/connection");

const updateComment = (comment_id, inc_votes) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .update("votes", inc_votes)
    .returning("*");
};

const removeComment = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del();
};

module.exports = { updateComment, removeComment };
