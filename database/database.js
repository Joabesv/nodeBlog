import { Sequelize } from 'sequelize';

import 'dotenv/config';

const connection = new Sequelize(
  process.env.db_name,
  process.env.user,
  process.env.pwd,
  { host: 'localhost', dialect: 'mysql', logging: false, timezone: '-03:00' }
);

export default connection;
