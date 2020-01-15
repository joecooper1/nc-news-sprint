const { topicsRouter } = require("../routers/topics-router");
const { usersRouter } = require("../routers/users-router");
const { articlesRouter } = require("../routers/articles-router");
const { commentsRouter } = require("../routers/comments-router");
const { getEndpoints } = require("../controllers/api-controllers");
const apiRouter = require("express").Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;