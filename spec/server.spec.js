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
  beforeEach(() => {
    return connection.seed.run;
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
          expect(result.body.users[0]).to.have.keys(
            "username",
            "avatar_url",
            "name"
          );
        });
    });
    it("GET:200 gets user by username", () => {
      return request(server)
        .get("/api/users/rogersop")
        .expect(200)
        .then(result => {
          expect(result.body.users).to.be.an("array");
          expect(result.body.users[0].name).to.equal("paul");
        });
    });
  });
  describe("/articles", () => {
    it("GET:200 returns article by article id", () => {
      return request(server)
        .get("/api/articles/5")
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.have.keys(
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "author",
            "comment_count"
          );
          expect(response.body.articles[0].comment_count).to.equal(2);
        });
    });
    it("PATCH:200 updates an article by adding votes and returns the article", () => {
      return request(server)
        .patch("/api/articles/2")
        .send({ inc_votes: 50 })
        .expect(200)
        .then(result => {
          expect(result.body.articles[0].votes).to.equal(50);
        });
    });
    it("POST:201 adds a new comment to an article and returns the comment", () => {
      return request(server)
        .post("/api/articles/3/comments")
        .send({
          username: "lurker",
          body: "Nice!!!!!"
        })
        .expect(201)
        .then(result => {
          expect(result.body.comment[0]).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "body",
            "votes",
            "created_at"
          );
        });
    });
    it("GET:200 returns array of comments on each article", () => {
      return request(server)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(result => {
          expect(result.body.comments).to.be.an("array");
          expect(result.body.comments[0]).to.have.keys(
            "comment_id",
            "author",
            "body",
            "votes",
            "created_at"
          );
        });
    });
    it("GET:200 returns array of comments sorted by a valid column in specified order", () => {
      return request(server)
        .get("/api/articles/1/comments?sort_by=author&order=desc")
        .expect(200)
        .then(result => {
          expect(result.body.comments).to.be.sortedBy("author", {
            descending: true
          });
        });
    });
    it("GET:200 returns array of all articles", () => {
      return request(server)
        .get("/api/articles")
        .expect(200)
        .then(result => {
          expect(result.body.articles).to.be.an("array");
          expect(result.body.articles[1]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET:200 returns array of all articles sorted by a valid column in a specified order", () => {
      return request(server)
        .get("/api/articles?sort_by=title&order=desc")
        .expect(200)
        .then(result => {
          expect(result.body.articles).to.be.sortedBy("title", {
            descending: true
          });
        });
    });
    it("GET:200 returns array of all articles filtered by author and/or topic", () => {
      return request(server)
        .get("/api/articles?author=rogersop&topic=mitch")
        .expect(200)
        .then(result => {
          expect(result.body.articles.length).to.equal(2);
        });
    });
  });
  describe("/comments", () => {
    xit("PATCH:200 updates a comment by adding votes and returns the comment", () => {
      return request(server)
        .patch("/api/comments/6")
        .send({ inc_votes: -20 })
        .expect(200)
        .then(result => {
          expect(result.body.comments[0].votes).to.equal(-20);
        });
    });
  });
});
