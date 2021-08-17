import express from 'express';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import connection from '../database/database.js';

// Rotas
import categoriesRouter from './routes/Categories.js';
import articleRouter from './routes/Article.js';
import userRouter from './routes/User.js';

// Models
import Category from './model/Category.js';
import Article from './model/Article.js';
import User from './model/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// sessions
app.use(
  session({
    secret: 'kkdfjghjfkhgjkdhkgjfhkjghjdkhirhgiejkmmfgnfghikj',
    cookie: { maxAge: 3000000 },
  })
);

// view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// static

app.use(express.static(path.join(__dirname, 'public')));

// pegando dados do form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database

connection
  .authenticate()
  .then(() => {
    console.log('authenticated');
  })
  .catch((err) => {
    console.log(err);
  });

// rotas
app.use('/', categoriesRouter);
app.use('/', articleRouter);
app.use('/', userRouter);

app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', { articles, categories });
    });
  });
});

app.get('/:slug', (req, res) => {
  const { slug } = req.params;

  Article.findOne({
    where: {
      slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('article', { article, categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
  const { slug } = req.params;
  Category.findOne({
    where: {
      slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render('index', { articles: category.articles, categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch(() => res.redirect('/'));
});

app.listen(port, () => {
  console.log(`Backend Started at http://localhost:${port}`);
});
