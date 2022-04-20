const express = require('express');
const slugify = require('slugify');
const Category = require('../categories/Category');
const Article = require('./Article');
 
const router = express.Router();

router.get('/admin/articles', (req, res) => {
  res.render('admin/articles');  
})

router.get('/admin/articles/new', (req, res) => {
  Category.findAll({ raw: true }).then(categories => {
    res.render('admin/articles/new', {categories});
  }).catch(error => {
    console.log(`❌ Erro ao resgatar categorias: ${error}`);
  })
})

router.post('/admin/articles/new', (req, res) => {
  const { title, category, body } = req.body;

  console.log(body);

  Article.create({
    title,
    body,
    slug: slugify('title'),
    categoryID: category,
  }).then(() => {
    res.redirect('/articles');
  }).catch(error => {
    console.log(`❌ Erro ao salvar artigo: ${error}`);
  })
})

module.exports = router;
