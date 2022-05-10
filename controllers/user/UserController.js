const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./User');

router.get('/admin/users', (req, res) => {
  User.findAll().then(users => {
    res.render('admin/users/index', {users});
  })
});

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create');
});


router.post('/admin/users/create', (req, res) => {
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


module.exports = router;