const express = require('express');
const bodyParser = require('body-parser');

const connection = require('./database/connection');
const categoriesController = require('./categories/CategoriesController'); 
const articlesController = require('./articles/ArticlesControllers'); 
const Article = require('./articles/Article');
const Category = require('./categories/Category');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.authenticate().then(() => {
  console.log('Conectado com o banco de dados! 🚀');
}).catch(error => {
  console.log('Falha ao conectar com banco de dados ❌');
  console.log(error);
});

app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
  Article.findAll({
    raw: true, 
    order: [['id', 'DESC']],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles, categories });
    })
  }).catch(error => res.send(`❌ Falha ao recuperar dados: ${error}`));
});

app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  Article.findOne({ 
    raw: true, 
    where: { slug }
  }).then(article => {
    if(article) {
      Category.findAll().then(categories => {
        res.render('article', { article, categories });
      }) 
    } else {
      res.redirect('/');
    }
  }).catch(error => {
    console.log(`❌ Falha ao recuperar artigo pelo slug "${slug}": ${error}`)
    res.redirect('/');
  })
});

app.get('/categoria/:slug', (req, res) => {
  const { slug } = req.params;
  Category.findOne({ 
    where: { slug },
    include: [{model: Article}]
  }).then(category => {
    if(category) {
      Category.findAll().then(categories => {
        res.render('index', {
          articles: category.articles,
          categories
        })
      })
    } else {
      res.redirect('/');
    }
  }).catch(error => {
    console.log(`❌ Falha ao filtrar artigos pela categoria "${slug}": ${error}`)
    res.redirect('/');
  }) 
})




app.listen(4000, err => {
  err ? console.log('Falha ao iniciar servidor! ❌') : console.log('Servidor rodando! 🚀');
});
