const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const handlebars = require('express-handlebars');
const Article = require('mongoose').model('Article');

module.exports = (app) => {
  app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs');
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'top nomer1 @ secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user;
      res.locals.isAdmin = res.locals.currentUser.roles.indexOf('Admin') > -1;
    }
    next();
  });

  app.use(async (req, res, next) => {
    const articles = await Article.find({}).sort('-dateCreated').limit(1);

    if (articles.length > 0) {
      res.locals.globalLatestArticleId = articles[0]._id;
    }
    next();
  });

  app.use(express.static('static'));

  console.log('Express ready!');
};
