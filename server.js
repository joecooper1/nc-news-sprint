const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");
const fs = require("fs");

const errorCatch = (req, res, next) => {
  const err = { status: 404, msg: "Not found" };
  next(err);
};

server.use(express.json());

server.use(function textLogger(req, res, next) {
  const data = `Received ${req.method} request for ${req.url} at ${Date.now()}`;
  fs.appendFile("./log.txt", JSON.stringify(data) + `\n`, err => {
    if (err) console.log(err);
    next();
  });
});

server.use("/api", apiRouter);

server.use("/*", errorCatch);

server.use((err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else next(err);
});

server.use((err, req, res, next) => {
  const psqlCodes = {
    "22P02": { msg: "Invalid data type", status: 400 },
    "23503": { msg: "Not found", status: 404 },
    "42703": { msg: "Invalid query", status: 400 }
  };
  if (psqlCodes.hasOwnProperty(err.code))
    res
      .status(psqlCodes[err.code].status)
      .send({ msg: psqlCodes[err.code].msg });
  else next(err);
});

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Oops!" });
});

module.exports = server;
