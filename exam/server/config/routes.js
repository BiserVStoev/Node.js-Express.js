const controllers = require('../controllers');
const auth = require('./auth');

module.exports = (app) => {
  app.get('/', controllers.home.index);

  app.get('/register', controllers.users.registerGet);
  app.post('/register', controllers.users.registerPost);
  app.get('/login', controllers.users.loginGet);
  app.post('/login', controllers.users.loginPost);
  app.post('/logout', controllers.users.logout);

  app.get('/create', auth.isAuthenticated, controllers.articles.createGet);
  app.post('/create', auth.isAuthenticated, controllers.articles.createPost);

  app.get('/articles', controllers.articles.all);
  app.get('/article/:id', controllers.articles.details);
  app.get('/article/:id/edit', auth.isAuthenticated, controllers.articles.editGet);
  app.post('/article/:id/edit', auth.isAuthenticated, controllers.articles.editPost);
  app.get('/article/:id/history', auth.isAuthenticated, controllers.articles.viewHistory);
  app.get('/article/history/:editId', auth.isAuthenticated, controllers.articles.viewOldArticle)

  app.get('/lock/:id', auth.isInRole('Admin'), controllers.articles.lock);
  app.get('/unlock/:id', auth.isInRole('Admin'), controllers.articles.unlock);

  app.all('*', (req, res) => {
    res.status(404);
    res.send('404 Not Found!');
    res.end();
  })
}
