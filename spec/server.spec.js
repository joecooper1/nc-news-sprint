process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-sorted"));
const { expect } = chai;
const request = require("supertest");
const server = require("../server");

describe("/API", () => {
  describe("/topics", () => {});
  describe("/users", () => {});
  describe("/articles", () => {});
  describe("/comments", () => {});
});
