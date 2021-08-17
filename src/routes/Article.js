import express from 'express';

import slugify from 'slugify';

import Category from '../model/Category.js';
import Article from '../model/Article.js';
import adminAuth from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render('admin/articles/index', { articles });
  });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render('admin/articles/new', { categories });
  });
});

router.post('/articles/save', adminAuth, (req, res) => {
  const { title, body, category } = req.body;

  Article.create({
    title,
    slug: slugify(title),
    body,
    categoryId: category,
  }).then(() => {
    res.redirect('/admin/articles');
  });
});

// Fazendo o Delete

router.post('/articles/delete', adminAuth, (req, res) => {
  const { id } = req.body;

  if (id != undefined) {
    if (!Number.isNaN(id)) {
      Article.destroy({
        where: {
          id,
        },
      }).then(() => {
        res.redirect('/admin/articles');
      });
    } else {
      // CASO NÃO SEJA UM NÚMERO
      res.redirect('admin/articles');
    }
  } else {
    // NULL
    res.redirect('admin/articles');
  }
});

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('admin/articles/edit', { categories, article });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      res.redirect('/');
      console.log(err);
    });
});

router.post('/articles/update', adminAuth, (req, res) => {
  const { id, title, body, category } = req.body;

  Article.update(
    { title, body, categoryId: category, slug: slugify(title) },
    {
      where: {
        id,
      },
    }
  )
    .then(() => {
      res.redirect('/admin/articles');
    })
    .catch(() => {
      res.redirect('/');
    });
});

router.get('/articles/page/:num', (req, res) => {
  const page = req.params.num;
  let offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page, 10) - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset,
    order: [['id', 'DESC']],
  }).then((articles) => {
    let next;

    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    const result = {
      page: parseInt(page, 10),
      next,
      articles,
    };

    Category.findAll().then((categories) => {
      res.render('admin/articles/page', { result, categories });
    });
  });
});

export default router;
/*
 * CategoryId (foreignKey) é um campo gerado pelo relacionamento entre o artigo
 *  e a categoria -> Article.belongsTo(Category);
 *
 */
