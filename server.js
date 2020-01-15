const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");
const fs = require("fs");
const {
  errorCatch,
  customErrorCatch,
  psqlErrorCatch,
  serverErrorCatch
} = require("./controllers/error-handlers");

server.use(express.json());

server.use(function textLogger(req, res, next) {
  const data = `Received ${req.method} request for ${req.url} at ${new Date(
    Date.now()
  )}`;
  fs.appendFile("./log.txt", JSON.stringify(data) + `\n`, err => {
    if (err) console.log(err);
    next();
  });
});

server.use("/api", apiRouter);

server.use("/*", errorCatch);

server.use(customErrorCatch);

server.use(psqlErrorCatch);

server.use(serverErrorCatch);

const { PORT = 9090 } = process.env;
server.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = server;
