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

router.get('/admin/articles/edit/:id', (req, res) => {
  const { id } = req.params;
  Article.findByPk(id).then(article => {
    if(article) {
      Category.findAll({ raw: true }).then(categories => {
        res.render('admin/articles/edit', { categories, article });
      })
    } else {
      res.redirect('/admin/articles');  
    }
  }).catch(error => {
    console.log(`❌ Erro ao buscar artigo: ${error}`);
    res.redirect('/admin/articles');
  });
})

router.post('/admin/articles/update', (req, res) => {
  const { id, title, body, category } = req.body;
  Article.update({
    title, body,
    categoryId: category,
    slug: slugify(title),    
  }, {
    where: {id}
  }).then(() => {
    res.redirect('/admin/articles');
  }).catch(error => {
    console.log(`❌ Erro ao editar artigo: ${error}`);
  });
});

router.get('/articles/page/:page', (req, res) => {
  const { page } = req.params;
  const limit = 4;
  let offset = 0;

  if(isNaN(page) || page <= 1) {
    offset = 0;
  } else {
    offset = limit * (page - 1) ;
  }

  Article.findAndCountAll({
    limit, offset, order: [[ 'id', 'DESC' ]]
  }).then(articles => {
    const result = {
      articles,
      next: offset + 4 <= articles.count // Verifica se existe mais páginas a serem exibidas;
    }
    res.json(result);
  });
})

module.exports = router;
