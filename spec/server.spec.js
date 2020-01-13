process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-sorted"));
const { expect } = chai;
const request = require("supertest");
const server = require("../server");
const connection = require("../db/connection");

describe("/API", () => {
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET:200 returns an array of all topics", () => {
      return request(server)
        .get("/api/topics")
        .expect(200)
        .then(result => {
          expect(result.body.topics).to.be.an("array");
        });
    });
  });
  describe("/users", () => {
    it("GET:200 gets array of all users", () => {
      return request(server)
        .get("/api/users")
        .expect(200)
        .then(result => {
          expect(result.body.users).to.be.an("array");
        });
    });
  });
  describe("/articles", () => {});
  describe("/comments", () => {});
});
