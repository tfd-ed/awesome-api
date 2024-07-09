const dotenv = require('dotenv');

dotenv.config({
  path: __dirname + '/.env.local.prod',
});

console.log(__dirname + '/dist/modules/**/*.entity.js');

const {
  DB_TYPE,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE,
  DB_SYNC,
} = process.env;

module.exports = {
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  migrations: [__dirname + '/dist/migrations/*{.js}'],
  entities: [__dirname + '/dist/modules/**/*.entity.js'],
  subscribers: [__dirname + '/dist/**/*.subscriber.js'],
  synchronize: DB_SYNC,
};
