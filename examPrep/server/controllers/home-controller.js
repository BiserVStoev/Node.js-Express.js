const productApi = require('../api/product');

module.exports = {
  index: async (req, res) => {
    const products =  await productApi.getAll();
    
    res.render('home/index', {products});
  }
}
