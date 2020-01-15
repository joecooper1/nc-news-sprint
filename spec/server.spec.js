process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-sorted"));
const { expect } = chai;
const request = require("supertest");
const server = require("../server");
const connection = require("../db/connection");

describe("/API", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
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
    it("GET:404 not found if anything is added on the end of topics", () => {
      return request(server)
        .get("/api/topics")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
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
    it("ERROR:404 when given non-existent username", () => {
      return request(server)
        .get("/api/users/arnold")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
  });
  describe("/articles", () => {
    xit("GET:200 returns article by article id", () => {
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
    xit("GET:400 errors with message invalid data type if given a string as a parameter", () => {
      return request(server)
        .get("/api/articles/five")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type");
        });
    });
    xit("GET:404 errors with message not found if given non-existent id", () => {
      return request(server)
        .get("/api/articles/500")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
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
    it("PATCH:404 errors with message not found if given non-existant id", () => {
      return request(server)
        .patch("/api/articles/2000")
        .send({ inc_votes: 50 })
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("PATCH:400 errors with message invalid data type if given invalid id", () => {
      return request(server)
        .patch("/api/articles/ahundred")
        .send({ inc_votes: 50 })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid data type");
        });
    });
    it("PATCH:400 errors with message invalid data type if given invalid votes value", () => {
      return request(server)
        .patch("/api/articles/2")
        .send({ inc_votes: "twenty" })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid data type");
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
    it("POST:404 errors with message article not found if given non-existant id", () => {
      return request(server)
        .post("/api/articles/30/comments")
        .send({
          username: "lurker",
          body: "Nice!!!!!"
        })
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("POST:400 errors with message Cannot post empty comment if not given required body", () => {
      return request(server)
        .post("/api/articles/3/comments")
        .send({
          username: "lurker"
        })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Cannot post empty comment!");
        });
    });
    it("POST:400 errors with message Must specify username if not given required username", () => {
      return request(server)
        .post("/api/articles/3/comments")
        .send({
          body: "hahahhaha"
        })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Must specify username!");
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
    it("GET:200 returns empty array if given id of article with no comments", () => {
      return request(server)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(result => {
          expect(result.body.comments).to.be.an("array");
          expect(result.body.comments.length).to.equal(0);
        });
    });
    it("GET:404 errors with message not found if given non-existent id", () => {
      return request(server)
        .get("/api/articles/500/comments")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("GET:400 errors with message invalid data type if given invalid id", () => {
      return request(server)
        .get("/api/articles/fivehundred/comments")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid data type");
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
    it("GET:400 errors with message Invalid query if given non-existent column", () => {
      return request(server)
        .get("/api/articles/9/comments?sort_by=turnip")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid query");
        });
    });
    it("GET:400 errors with message about order if given invalid order_by argument", () => {
      return request(server)
        .get("/api/articles/9/comments?order=down")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Order must be 'asc' or 'desc'");
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
    it("GET:400 errors with message Invalid query if given non-existant column", () => {
      return request(server)
        .get("/api/articles?sort_by=best&order=asc")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid query");
        });
    });
    it("GET:400 errors with message about order if given invalid order_by argument", () => {
      return request(server)
        .get("/api/articles?sort_by=title&order=first")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Order must be 'asc' or 'desc'");
        });
    });
    it("GET:200 returns empty array if given non-existent author", () => {
      return request(server)
        .get("/api/articles?author=larry")
        .expect(200)
        .then(result => {
          expect(result.body.articles).to.be.an("array");
          expect(result.body.articles.length).to.equal(0);
        });
    });
    it("GET:200 returns empty array if given non-existent topic", () => {
      return request(server)
        .get("/api/articles?topic=food")
        .expect(200)
        .then(result => {
          expect(result.body.articles).to.be.an("array");
          expect(result.body.articles.length).to.equal(0);
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
  describe.only("/comments", () => {
    it("PATCH:200 updates a comment by adding votes and returns the comment", () => {
      return request(server)
        .patch("/api/comments/6")
        .send({ inc_votes: -20 })
        .expect(200)
        .then(result => {
          expect(result.body.comment[0].votes).to.equal(-20);
        });
    });
    it("PATCH:404 errors with message Not found if given a non-existent id", () => {
      return request(server)
        .patch("/api/comments/666")
        .send({ inc_votes: 666 })
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:204 deletes a comment", () => {
      return request(server)
        .delete("/api/comments/6")
        .expect(204);
    });
  });
});
