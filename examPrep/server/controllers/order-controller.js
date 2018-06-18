const productApi = require('../api/product');
const orderApi = require('../api/order');

module.exports = {
    placeGet: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await productApi.getById(id);
            res.render('order/place', product);
        } catch (err) {

        }
    },
    placePost: async (req, res) => {
        const data = req.body;
        data.creator = req.user._id;
        try {
            await orderApi.create(data);
            res.redirect('/');
        } catch (err) {
            console.log(err);
            res.render('order/place', { error: err.message })
        }

        res.json(req.body);
    },
    status: async (req, res) => {
        const orders = await orderApi.getByUserId(req.user._id);
        res.render('order/status', {
            orders
        });
    },
    details: async (req, res) => {
        const id = req.params.id;
        const order = await orderApi.getById(id);
        res.render('order/details', order);
    }
};