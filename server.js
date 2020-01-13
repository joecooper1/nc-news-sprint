const express = require("express");
const server = express();
const apiRouter = require("./routers/api-router");

server.use(express.json());

server.use("/api", apiRouter);

module.exports = server;
