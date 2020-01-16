const getEndpoints = (req, res, next) => {
  const possibleEndpoints = {
    "GET /topics": "get list of all topics",
    "POST /topics": "add a new topic",
    "GET /users": "get list of all users",
    "GET /users/:username": "get user by username",
    "POST /users": "add a new user",
    "GET /articles/:article_id": "get article by id",
    "PATCH /articles/:article_id": "update vote count for article",
    "POST /articles/:article_id/comments": "add comment to article",
    "GET /articles/:article_id/comments":
      "get all comments for article, accepts queries sort_by and order",
    "GET /articles":
      "get all articles, accepts queries sort_by, order, author and topic",
    "PATCH /comments/:comment_id": "updates vote count for comment",
    "DELETE /comments/:comment_id": "deletes comment"
  };
  console.log(possibleEndpoints);
  res.status(200).send(JSON.stringify(possibleEndpoints));
};

const methodDisallowed = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

module.exports = { getEndpoints, methodDisallowed };
