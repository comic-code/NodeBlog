const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('./User');
const auth = require('../../middlewares/auth');

router.get('/admin/users', auth, (req, res) => {
  
  User.findAll().then(users => {
    res.render('admin/users/index', {users});
  })
});

router.get('/admin/users/create', auth, (req, res) => {
  res.render('admin/users/create');
});

router.post('/admin/users/create', auth, (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ where: {email} }).then(user => {
    if(!user) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
    
      User.create({ email, name, password: hash}).then(() => {
        res.redirect('/');
      }).catch(err => {
        console.log(`Falha ao criar novo usuário: ${err}`);
        res.redirect('/admin/users/create');
      });
    } else {
      res.redirect('/admin/users/create');
    }
  } )

});

router.get('/login', (req, res) => {
  res.render('admin/users/login');
})

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({where: {email}}).then(user => {
    if(user) {
      const correctPassword = bcrypt.compareSync(password, user.password);
      if(correctPassword) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  })
});

router.get('/logout', function(req, res) {
  req.session.user = undefined;
  res.redirect('/');  
});

module.exports = router;