const { topicsRouter } = require("../routers/topics-router");
const { usersRouter } = require("../routers/users-router");
const apiRouter = require("express").Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
