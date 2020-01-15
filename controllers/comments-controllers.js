const { updateComment, removeComment } = require("../models/comments-models");

const patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateComment(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => next(err));
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(count => {
      res.status(204).send();
    })
    .catch(err => next(err));
};

module.exports = { patchComment, deleteComment };
