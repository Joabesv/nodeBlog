import Sequelize from 'sequelize';

import connection from '../../database/database.js';

import Category from './Category.js';

const Article = connection.define('articles', {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Category.hasMany(Article); // One to Many
Article.belongsTo(Category); // One to One

export default Article;
