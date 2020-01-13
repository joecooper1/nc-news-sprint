exports.up = function(knex) {
  return knew.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.int("article_id").references("articles.article_id");
    commentsTable.string("body", [500]);
    commentsTable.int("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
