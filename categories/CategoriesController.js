const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new');
})

router.get('/admin/categories', (req, res) => {
  Category.findAll({ raw: true }).then(categories => {
    res.render('admin/categories', {categories});
  }) 
})

router.post('/admin/categories/new', (req, res) => {
  const { title } = req.body;
  if(title) {
    Category.findAll({ raw: true }).then(categories => {
      const found = categories.find(category => category.title === title);
      if(!found) {
        Category.create({
          title,
          slug: slugify(title)
        }).then(() => {
          res.redirect('/admin/categories');
        })
      } else {
        res.redirect('/admin/categories/new');  
      }
    })
  } else {
    res.redirect('/admin/categories/new');
  }
});

router.post('/admin/categories/delete', (req, res) => {
  const { id } = req.body;
  if(id && !isNaN(id)) {
    Category.destroy({
      where: { id }
    }).then(() => {
      res.redirect('/admin/categories');
    })
  } else {
    res.redirect('/admin/categories');
  }
})

module.exports = router;