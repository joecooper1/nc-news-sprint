const ENV = process.env.NODE_ENV || "test";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: "nc_news",
      user: "joecooper",
      password: "password"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: "joecooper",
      password: "password"
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
