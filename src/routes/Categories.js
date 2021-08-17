import express from 'express';

import slugify from 'slugify';
import Category from '../model/Category.js';

const router = express.Router();

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new');
});

// Quando Trabalhar com forms sempre utilize método POST
router.post('/categories/save', (req, res) => {
  const { title } = req.body;
  if (title != undefined) {
    Category.create({ title, slug: slugify(title) }).then(() => {
      res.redirect('/admin/categories');
    });
  } else {
    res.redirect('/admin/categories/new');
  }
});

router.get('/admin/categories', (req, res) => {
  Category.findAll().then((categories) => {
    res.render('admin/categories/index', { categories });
  });
});

router.post('/categories/delete', (req, res) => {
  const { id } = req.body;

  if (id != undefined) {
    if (!Number.isNaN(id)) {
      Category.destroy({
        where: {
          id,
        },
      }).then(() => {
        res.redirect('/admin/categories');
      });
    } else {
      // CASO NÃO SEJA UM NÚMERO
      res.redirect('admin/categories');
    }
  } else {
    // NULL
    res.redirect('admin/categories');
  }
});

router.get('/admin/categories/edit/:id', (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect('/admin/categories');
  }

  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render('admin/categories/edit', { category });
      } else {
        res.redirect('/admin/categories');
      }
    })
    .catch((error) => {
      res.redirect('/admin/categories');
      console.log(error);
    });
});

// Atualizando categorias via form
router.post('/categories/update', (req, res) => {
  const { id, title } = req.body;
  /**
   * Para atualizar dados no Sequelize, passe primeiro O QUE você quer
   * atualizar e segundo AONDE você quer atualizar
   */
  Category.update(
    { title, slug: slugify(title) },
    {
      where: {
        id,
      },
    }
  ).then(() => {
    res.redirect('/admin/categories');
  });
});

export default router;

/*
  SLUG: otimiza o título para URLS
*/
