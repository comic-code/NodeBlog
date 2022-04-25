const express = require('express');
const slugify = require('slugify');
const Category = require('../categories/Category');
const Article = require('./Article');
 
const router = express.Router();

router.get('/admin/articles', (req, res) => {
  Article.findAll({ 
    raw: true,
    include: [{ model: Category }]
  }).then(articles => {
    console.log(articles);
    res.render('admin/articles', {articles});  
  }).catch(error => {
    console.log(`❌ Erro ao resgatar postagens: ${error}`);
  })
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

  console.log(category);

  Article.create({
    title,
    body,
    slug: slugify(title),
    categoryId: category,
  }).then(() => {
    res.redirect('/admin/articles');
  }).catch(error => {
    console.log(`❌ Erro ao salvar artigo: ${error}`);
  })
})

router.post('/admin/articles/delete', (req, res) => {
  const { id } = req.body;
  if(id && !isNaN(id)) {
    Article.destroy({
      where: { id }
    }).then(() => {
      res.redirect('/admin/articles');
    })
  } else {
    res.redirect('/admin/articles');
  }
})

module.exports = router;
