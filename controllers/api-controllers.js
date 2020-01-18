const getEndpoints = (req, res, next) => {
  const possibleEndpoints = {
    "GET /topics": "get list of all topics",
    "POST /topics": "add a new topic",
    "GET /users": "get list of all users",
    "GET /users/:username": "get user by username",
    "POST /users": "add a new user",
    "PATCH /users": "update user information",
    "GET /articles/:article_id": "get article by id",
    "PATCH /articles/:article_id":
      "update vote count for article, send in form {inc_votes: 1}, edit body using {body: new body}",
    "POST /articles/:article_id/comments": "add comment to article",
    "GET /articles/:article_id/comments":
      "get all comments for article, accepts queries sort_by, order, limit, and p (page)",
    "GET /articles":
      "get all articles, accepts queries sort_by, order, author, topic, title, year, limit and p (page)",
    "PATCH /comments/:comment_id":
      "updates vote count for comment, send in form {inc_votes: 1}",
    "DELETE /comments/:comment_id": "deletes comment",
    "GET /users/:user_id/favourites":
      "gets list of articles favourited by a user",
    "POST /users/:user_id/favourites/:article_id":
      "favourites or unfavourites an article"
  };
  res.status(200).send(JSON.stringify(possibleEndpoints));
};

const methodDisallowed = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

module.exports = { getEndpoints, methodDisallowed };
