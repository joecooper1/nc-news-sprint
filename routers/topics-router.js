const { getTopics } = require("../controllers/topics-controller");
const topicsRouter = require("express").Router();

const errorHandler = (req, res, next) => {
  next({ status: 404, msg: "Not found" });
};

topicsRouter.get("/", getTopics);
topicsRouter.get("/*", errorHandler);

module.exports = { topicsRouter };
