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

app.get('/', (req, res) => {
  Article.findAll({ raw: true }).then(articles => {
    res.render('index', { articles });
  }).catch(error => res.send(`❌ Falha: ${error}`))
});
app.use('/', categoriesController);
app.use('/', articlesController)

app.listen(4000, err => {
  err ? console.log('Falha ao iniciar servidor! ❌') : console.log('Servidor rodando! 🚀');
});
