const controllers = require('../controllers');
const auth = require('./auth');

module.exports = (app) => {
  app.get('/', controllers.home.index);
  app.get('/index.html', controllers.home.index);

  app.get('/users/register', controllers.users.registerGet);
  app.post('/users/register', controllers.users.registerPost);
  app.get('/users/login', controllers.users.loginGet);
  app.post('/users/login', controllers.users.loginPost);
  app.post('/users/logout', controllers.users.logout);

  app.get('/product/create', auth.isInRole('Admin'), controllers.product.createGet);
  app.post('/product/create', auth.isInRole('Admin'), controllers.product.createPost);

  app.get('/order/place/:id', auth.isAuthenticated, controllers.order.placeGet);
  app.post('/order/place', auth.isAuthenticated, controllers.order.placePost);
  app.get('/order', auth.isAuthenticated, controllers.order.status);
  app.get('/order/:id', auth.isAuthenticated, controllers.order.details);

  app.all('*', (req, res) => {
    res.status(404);
    res.send('404 Not Found!');
    res.end();
  })
}
