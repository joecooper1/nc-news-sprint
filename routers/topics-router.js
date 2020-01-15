const { getTopics } = require("../controllers/topics-controller");
const { methodDisallowed } = require("../controllers/api-controllers");
const topicsRouter = require("express").Router();

const errorHandler = (req, res, next) => {
  next({ status: 404, msg: "Not found" });
};

topicsRouter
  .route("/")
  .get(getTopics)
  .all(methodDisallowed);
topicsRouter.get("/*", errorHandler);

module.exports = { topicsRouter };
