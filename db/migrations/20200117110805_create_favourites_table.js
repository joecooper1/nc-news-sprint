exports.up = function(knex) {
  return knex.schema.createTable("favourites", favouritesTable => {
    favouritesTable.string("username").references("users.username");
    favouritesTable.integer("article_id").references("articles.article_id");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("favourites");
};
