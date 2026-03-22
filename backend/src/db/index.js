const { createSqliteAdapter } = require("./sqlite");
const { createPostgresAdapter } = require("./postgres");

const createDb = () => {
  const provider = (process.env.DB_PROVIDER || "sqlite").toLowerCase();
  if (provider === "postgres") {
    return createPostgresAdapter({
      host: process.env.PGHOST || "127.0.0.1",
      port: Number(process.env.PGPORT || "5432"),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "helpdesk",
    });
  }
  return createSqliteAdapter(process.env.SQLITE_PATH || "./data/helpdesk.db");
};

module.exports = { createDb };
