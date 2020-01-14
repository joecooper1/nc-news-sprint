const { selectUsers } = require("../models/users-model");

const getUsers = (req, res, next) => {
  const { username } = req.params;
  selectUsers(username)
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(err => next(err));
};

module.exports = { getUsers };
