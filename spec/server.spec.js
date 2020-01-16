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
        .get("/api/topics/5")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 errors with message not found if given invalid string after api", () => {
      return request(server)
        .get("/api/tropics")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("POST:201 posts new topic and returns it", () => {
      return request(server)
        .post("/api/topics")
        .send({ slug: "Hats", description: "All things headwear" })
        .expect(201)
        .then(result => {
          expect(result.body.topic).to.deep.equal({
            slug: "Hats",
            description: "All things headwear"
          });
        });
    });
    it("POST:400 errors with message incomplete post if body sent is not complete", () => {
      return request(server)
        .post("/api/topics")
        .send({ slog: "Hats", description: "All things headwear" })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid query");
        });
    });
    it("PATCH and DELETE:405 errors with message method not allowed", () => {
      return request(server)
        .delete("/api/topics")
        .expect(405)
        .then(result => {
          expect(result.body.msg).to.equal("Method not allowed");
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
          expect(result.body.users.length).to.equal(4);
        });
    });
    it("GET:200 gets user by username", () => {
      return request(server)
        .get("/api/users/rogersop")
        .expect(200)
        .then(result => {
          expect(result.body.user).to.be.an("object");
          expect(result.body.user.name).to.equal("paul");
        });
    });
    it("GET:404 errors with message not found when given non-existent username", () => {
      return request(server)
        .get("/api/users/arnold")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("POST:201 creates a new user", () => {
      return request(server)
        .post("/api/users")
        .send({
          username: "zoopazoopa890",
          name: "Gill",
          avatar_url: "fakeurl.com"
        })
        .expect(201)
        .then(response => {
          expect(response.body.user.name).to.equal("Gill");
        });
    });
    it("POST:403 errors with message username already taken if username already exists", () => {
      return request(server)
        .post("/api/users")
        .send({
          username: "lurker",
          name: "Gill",
          avatar_url: "fakeurl.com"
        })
        .expect(403)
        .then(response => {
          expect(response.body.msg).to.equal("Username already exists");
        });
    });
  });
  describe("/articles", () => {
    it("GET:200 returns article by article id", () => {
      return request(server)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys(
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "author",
            "comment_count"
          );
          expect(response.body.article.comment_count).to.equal(13);
        });
    });
    it("GET:400 errors with message invalid data type if given a string as a parameter", () => {
      return request(server)
        .get("/api/articles/five")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal("Invalid data type");
        });
    });
    it("GET:404 errors with message not found if given non-existent id", () => {
      return request(server)
        .get("/api/articles/500")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal("Not found");
        });
    });
    it("PATCH:200 updates an article by adding votes and returns the article", () => {
      return request(server)
        .patch("/api/articles/1")
        .send({ inc_votes: 50 })
        .expect(200)
        .then(result => {
          expect(result.body.article.votes).to.equal(150);
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
          expect(result.body.comment).to.have.keys(
            "comment_id",
            "author",
            "article_id",
            "body",
            "votes",
            "created_at"
          );
          expect(result.body.comment.body).to.equal("Nice!!!!!");
          expect(result.body.comment.author).to.equal("lurker");
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
    it("GET:200 returns array of comments on each article, default limit of 10", () => {
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
          expect(result.body.comments.length).to.equal(10);
          expect(result.body.comments[0].body).to.equal(
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
          );
        });
    });
    it("GET:200 works when limit is specified", () => {
      return request(server)
        .get("/api/articles/1/comments?limit=4")
        .expect(200)
        .then(result => {
          expect(result.body.comments.length).to.equal(4);
        });
    });
    it("GET:200 works when p is specified", () => {
      return request(server)
        .get("/api/articles/1/comments?limit=4&p=2")
        .expect(200)
        .then(result => {
          expect(result.body.comments.length).to.equal(4);
          expect(result.body.comments[0].body).to.equal(
            "I hate streaming eyes even more"
          );
        });
    });
    it("GET:400 errors with message invalid query if limit or p is invalid", () => {
      return request(server)
        .get("/api/articles/1/comments?limit=4.&p=pea")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Number must be a valid integer");
        });
    });
    it("GET:400 errors with message p cannot be less than one if p is zero", () => {
      return request(server)
        .get("/api/articles/1/comments?limit=3&p=0")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Page cannot be less than one");
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
    it("GET:200 returns array of all articles, limited to ten by default", () => {
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
          expect(result.body.articles.length).to.equal(10);
          expect(result.body.articles[0].title).to.equal(
            "Living in the shadow of a great man"
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
    it("GET:200 returns array of all articles, with limit set by query, page one by default", () => {
      return request(server)
        .get("/api/articles?limit=3")
        .expect(200)
        .then(result => {
          expect(result.body.articles.length).to.equal(3);
          expect(result.body.articles[0].title).to.equal(
            "Living in the shadow of a great man"
          );
        });
    });
    it("GET:200 returns array of all articles, with limit set, and with page set", () => {
      return request(server)
        .get("/api/articles?limit=3&p=2")
        .expect(200)
        .then(result => {
          expect(result.body.articles.length).to.equal(3);
          expect(result.body.articles[0].title).to.equal("Student SUES Mitch!");
        });
    });
    it("GET:400 errors with message invalid query if limit or p value is not a number", () => {
      return request(server)
        .get("/api/articles?limit=blue")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Number must be a valid integer");
        });
    });
    it("GET:400 errors with message invalid query if limit or p value is a decimal", () => {
      return request(server)
        .get("/api/articles?p=4.5")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Number must be a valid integer");
        });
    });
    it("GET:400 errors message Page can not be less than one if given p value less than 1", () => {
      return request(server)
        .get("/api/articles?limit=3&p=0")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Page cannot be less than one");
        });
    });
    it("GET:404 errors with message page not found if p is too high", () => {
      return request(server)
        .get("/api/articles?limit=3&p=100")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Page does not exist");
        });
    });
    it("GET:404 errors with message page not found if p is too high, while author or topic is specified", () => {
      return request(server)
        .get("/api/articles?author=rogersop&topic=mitch&limit=3&p=100")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Page does not exist");
        });
    });
    it("GET:200 responds with a total_count property, displaying total number of articles available", () => {
      return request(server)
        .get("/api/articles?limit=3&p=2")
        .expect(200)
        .then(result => {
          expect(result.body.total_count).to.equal(12);
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
    it("GET:404 errors with message not found if given non-existent author", () => {
      return request(server)
        .get("/api/articles?author=larry")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("GET:404 errors with message not found if given non-existent topic", () => {
      return request(server)
        .get("/api/articles?topic=food")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("GET:200 returns empty array if given author with no articles", () => {
      return request(server)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(result => {
          expect(result.body.articles.length).to.equal(0);
          expect(result.body.articles).to.be.an("array");
          expect(result.body.total_count).to.equal(0);
        });
    });
    it("GET:200 returns empty array if given topic with no articles", () => {
      return request(server)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(result => {
          expect(result.body.articles.length).to.equal(0);
          expect(result.body.articles).to.be.an("array");
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
    it("PATCH:200 updates a comment by adding votes and returns the comment", () => {
      return request(server)
        .patch("/api/comments/6")
        .send({ inc_votes: -20 })
        .expect(200)
        .then(result => {
          expect(result.body.comment.votes).to.equal(-20);
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
    it("PATCH:400 errors with message Invalid data type if given invalid Id", () => {
      return request(server)
        .patch("/api/comments/one")
        .send({ inc_votes: 666 })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid data type");
        });
    });
    it("PATCH:400 errors with message Invalid data type if given invalid vote value", () => {
      return request(server)
        .patch("/api/comments/1")
        .send({ inc_votes: "all" })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid data type");
        });
    });
    it("PATCH:400 errors with message Update body incomplete if not given valid inc_votes key in body", () => {
      return request(server)
        .patch("/api/comments/1")
        .send({ votes: 100 })
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Update body incomplete");
        });
    });
    it("PATCH:200 works if another invalid key is also included in update", () => {
      return request(server)
        .patch("/api/comments/1")
        .send({ inc_votes: 1, title: "New title" })
        .expect(200)
        .then(result => {
          expect(result.body.comment.votes).to.equal(17);
        });
    });
    it("DELETE:204 deletes a comment", () => {
      return request(server)
        .delete("/api/comments/6")
        .expect(204);
    });
    it("DELETE:404 errors with message Not found if deleting a non-existent id", () => {
      return request(server)
        .delete("/api/comments/6000")
        .expect(404)
        .then(result => {
          expect(result.body.msg).to.equal("Not found");
        });
    });
    it("DELETE:400 errors with message Invalid data type if deleting an invalid id", () => {
      return request(server)
        .delete("/api/comments/six")
        .expect(400)
        .then(result => {
          expect(result.body.msg).to.equal("Invalid data type");
        });
    });
  });
  describe("/other", () => {
    it("GET:200 returns info on all possible endpoints", () => {
      return request(server)
        .get("/api")
        .expect(200)
        .then(result => {
          expect(result.text).to.be.a("string");
        });
    });
  });
});
