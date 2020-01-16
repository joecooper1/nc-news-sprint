const {
  selectUsers,
  insertUser,
  updateUser
} = require("../models/users-model");

const getUsers = (req, res, next) => {
  const { username } = req.params;
  selectUsers(username)
    .then(users => {
      if (users.length === 1) {
        user = users[0];
        res.status(200).send({ user });
      } else res.status(200).send({ users });
    })
    .catch(err => next(err));
};

const postUser = (req, res, next) => {
  insertUser(req.body)
    .then(user => {
      res.status(201).send({ user: user[0] });
    })
    .catch(err => next(err));
};

const patchUser = (req, res, next) => {
  updateUser(req.body, req.params)
    .then(user => {
      res.status(200).send({ user: user[0] });
    })
    .catch(err => next(err));
};

module.exports = { getUsers, postUser, patchUser };
