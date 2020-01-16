const { getUsers, postUser } = require("../controllers/users-controller");
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
  .all(methodDisallowed);

module.exports = { usersRouter };
