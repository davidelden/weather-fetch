module.exports = {
  client: 'pg',
  connection: {
    host: 'db_weather_fetch',
    user: 'postgres',
    // host: process.env.DATABASE_HOST, // Host is docker-compose service name
    // user: process.env.DATABASE_USER,
    database: 'weather_fetch_data'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds/dev'
  }
};
