const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");

server.use(express.json());

server.use("/api", apiRouter);

server.use((err, req, res, next) => {
  res.status(404).send({ msg: "RED ALERT!" });
  console.log(err);
});

module.exports = server;
