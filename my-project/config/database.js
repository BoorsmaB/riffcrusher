const path = require("path");

module.exports = ({ env }) => {
  // Use 'postgres' as the default database client
  const client = env("DATABASE_CLIENT", "postgres");

  const connections = {
    // Configuration for PostgreSQL
    postgres: {
      connection: {
        // Use DATABASE_URL if provided, otherwise fall back to individual parameters
        connectionString: env("DATABASE_URL"), // Optional, if you have a full connection string
        host: env("DATABASE_HOST", "dpg-crt8me5ds78s73ecun9g-a"), // Internal Render hostname
        port: env.int("DATABASE_PORT", 5432), // Default PostgreSQL port
        database: env("DATABASE_NAME", "jovanaar_reviews_database"), // Your database name
        user: env("DATABASE_USERNAME", "jovanaar_reviews_database_user"), // Your database username
        password: env("DATABASE_PASSWORD", "UWAQVsitWRNqg7397iH6DlgjjByMqp3a"), // Your database password
        ssl: {
          rejectUnauthorized: false, // Required for Render PostgreSQL
        },
        schema: env("DATABASE_SCHEMA", "public"), // Default schema
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2), // Minimum number of connections
        max: env.int("DATABASE_POOL_MAX", 10), // Maximum number of connections
      },
    },

    // MySQL configuration, if you decide to use it
    mysql: {
      connection: {
        connectionString: env("DATABASE_URL"), // Optional
        host: env("DATABASE_HOST", "localhost"), // Default to localhost if not using PostgreSQL
        port: env.int("DATABASE_PORT", 3306), // Default MySQL port
        database: env("DATABASE_NAME", "strapi"), // Default database name
        user: env("DATABASE_USERNAME", "strapi"), // Default MySQL user
        password: env("DATABASE_PASSWORD", "strapi"), // Default password
        ssl: env.bool("DATABASE_SSL", false) && {
          key: env("DATABASE_SSL_KEY", undefined),
          cert: env("DATABASE_SSL_CERT", undefined),
          ca: env("DATABASE_SSL_CA", undefined),
          capath: env("DATABASE_SSL_CAPATH", undefined),
          cipher: env("DATABASE_SSL_CIPHER", undefined),
          rejectUnauthorized: env.bool(
            "DATABASE_SSL_REJECT_UNAUTHORIZED",
            true
          ),
        },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },

    // SQLite configuration, if you're using it locally
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db")
        ),
      },
      useNullAsDefault: true, // Required for SQLite
    },
  };

  return {
    connection: {
      client,
      ...connections[client], // Choose the connection based on the client
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000), // Set connection timeout
    },
  };
};
