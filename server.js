const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");

server.use(express.json());

server.use("/api", apiRouter);

server.use((err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else next(err);
});

server.use((err, req, res, next) => {
  const psqlCodes = {
    "22P02": "Invalid data type",
    "23503": "Not found",
    "42703": "Invalid query"
  };
  const psqlStatuses = { "22P02": 400, "23503": 404, "42703": 400 };
  if (psqlCodes.hasOwnProperty(err.code))
    res.status(psqlStatuses[err.code]).send({ msg: psqlCodes[err.code] });
  else console.log(err);
});

module.exports = server;
