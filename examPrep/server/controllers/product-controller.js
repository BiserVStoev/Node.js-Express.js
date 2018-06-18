const productApi = require('../api/product');

module.exports = {
    createGet: (req, res) => {
        res.render('product/create');
    },
    createPost: async (req, res) => {
        try {
            const product = await productApi.create(req.body);
            res.redirect('/');
        } catch (err) {
            console.log(err);
            res.render('product/create', {
                error: err.message,
                formData: {
                    category: req.body.category,
                    size: req.body.size,
                    imageUrl: req.body.imageUrl,
                    toppings: req.body.toppings
                }
            });
        }
    }
};