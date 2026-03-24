const { createSqliteAdapter } = require("./sqlite");
const { createPostgresAdapter } = require("./postgres");

const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const createDb = () => {
  const provider = (process.env.DB_PROVIDER || "sqlite").toLowerCase();
  if (provider === "postgres") {
    const useConnectionString = Boolean(process.env.DATABASE_URL);
    const sslEnabled = parseBool(process.env.PGSSL, false);
    const sslRejectUnauthorized = parseBool(
      process.env.PGSSL_REJECT_UNAUTHORIZED,
      false
    );

    const config = useConnectionString
      ? {
          connectionString: process.env.DATABASE_URL,
        }
      : {
          host: process.env.PGHOST || "127.0.0.1",
          port: Number(process.env.PGPORT || "5432"),
          user: process.env.PGUSER || "postgres",
          password: process.env.PGPASSWORD || "postgres",
          database: process.env.PGDATABASE || "helpdesk",
        };

    if (sslEnabled) {
      config.ssl = { rejectUnauthorized: sslRejectUnauthorized };
    }

    return createPostgresAdapter(config);
  }
  return createSqliteAdapter(process.env.SQLITE_PATH || "./data/helpdesk.db");
};

module.exports = { createDb };
