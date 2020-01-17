const {
  getUsers,
  postUser,
  patchUser,
  getFavouritedArticles,
  postNewFavourite
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
usersRouter
  .route("/:username/favourites")
  .get(getFavouritedArticles)
  .all(methodDisallowed);
usersRouter
  .route("/:username/favourites/:article_id")
  .post(postNewFavourite)
  .all(methodDisallowed);

module.exports = { usersRouter };
