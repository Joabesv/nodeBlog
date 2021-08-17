import express from 'express';
import bcrypt from 'bcrypt';
import User from '../model/User.js';

const router = express.Router();

router.get('/admin/users', (req, res) => {
  User.findAll()
    .then((users) => {
      res.render('admin/users/index', { users });
    })
    .catch(() => {
      res.redirect('');
    });
});

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create');
});

router.post('/users/create', (req, res) => {
  const { password, email } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    if (user == undefined) {
      // setting bcrypt
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      User.create({ email, password: hash })
        .then(() => {
          res.redirect('/admin/users');
        })
        .catch(() => {
          res.redirect('/');
        });
    } else {
      res.redirect('/admin/users/create');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('admin/users/login');
});

router.post('/auth', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } }).then((user) => {
    // email = true
    if (user != undefined) {
      // valida senha
      const correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect('/admin/articles');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('login');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

export default router;
