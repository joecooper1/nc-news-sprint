const {
  getUsers,
  postUser,
  patchUser
} = require("../controllers/users-controller");
const { methodDisallowed } = require("../controllers/api-controllers");
const usersRouter = require("express").Router();

usersRouter
  .route("/")
  .get(getUsers)
  .post(postUser)
  .all(methodDisallowed);
usersRouter
  .route("/:username")
  .get(getUsers)
  .patch(patchUser)
  .all(methodDisallowed);

module.exports = { usersRouter };
