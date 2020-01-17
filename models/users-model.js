const connection = require("../db/connection");

const selectUsers = (username = "%") => {
  return connection("users")
    .select("*")
    .where("username", "like", username)
    .then(users => {
      if (users.length === 0)
        return Promise.reject({ status: 404, msg: "Not found" });
      else return users;
    });
};

const insertUser = body => {
  return connection("users")
    .insert(body)
    .returning("*");
};

const updateUser = ({ name, avatar_url }, params) => {
  return connection("users")
    .modify(queryString => {
      if (name) queryString.update({ name });
      if (avatar_url) queryString.update({ avatar_url });
      if (!name && !avatar_url) queryString.select("*");
    })
    .where("username", params.username)
    .returning("*")
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return user;
    });
};

const selectFavouritedArticles = ({ username }) => {
  return connection("favourites")
    .select(
      "articles.article_id",
      "title",
      "author",
      "topic",
      "created_at",
      "votes"
    )
    .innerJoin("articles", "articles.article_id", "favourites.article_id")
    .where("favourites.username", username)
    .then(articles => {
      if (articles.length === 0) {
        return connection("users")
          .select("*")
          .where("username", username)
          .then(users => {
            if (users.length === 0) {
              return Promise.reject({ status: 404, msg: "Not found" });
            } else {
              return articles;
            }
          });
      } else {
        return articles;
      }
    });
};

const insertFavourite = ({ username, article_id }) => {
  const checkUser = username => {
    return connection("users")
      .select("*")
      .where("username", username)
      .then(users => {
        if (users.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        return true;
      });
  };
  const checkArticle = article_id => {
    return connection("articles")
      .select("*")
      .where("article_id", article_id)
      .then(articles => {
        if (articles.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        return true;
      });
  };
  const favouriteCheck = (username, article_id) => {
    return connection("favourites")
      .select("*")
      .where({ username, article_id })
      .then(favourite => {
        if (favourite.length) {
          return connection("favourites")
            .del()
            .where({ username, article_id })
            .returning("*")
            .then(favourite => {
              return true;
            });
        }
      });
  };
  return Promise.all([
    checkUser(username),
    checkArticle(article_id),
    favouriteCheck(username, article_id)
  ]).then(([userCheck, articleCheck, favouriteCheck]) => {
    if (favouriteCheck) {
      return "Unfavourited";
    }
    if (userCheck && articleCheck) {
      return connection("favourites")
        .insert({ username, article_id })
        .returning("*")
        .then(favourite => {
          return "Favourited";
        });
    }
  });
};

module.exports = {
  selectUsers,
  insertUser,
  updateUser,
  selectFavouritedArticles,
  insertFavourite
};
