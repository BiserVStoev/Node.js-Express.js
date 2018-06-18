const Product = require('mongoose').model('Product');

const allowedToppings = [
    'pickle',
    'tomato',
    'onion',
    'lettuce',
    'hot sauce',
    'extra sauce'
];

const categoryLabels = {
    'chicken': 'Chicken Doner',
    'beef': 'Beef Doner',
    'lamb': 'Lamb Doner'
}

function getName(category, size) {
    return `${categoryLabels[category]}, ${size}cm`;
}

async function create(data) {
    const { category, size, imageUrl } = data;
    const toppings = data.toppings.split(',').map(e => e.trim()).filter(e => e.length > 0 && allowedToppings.includes(e));
    return await Product.create({
        category,
        size: Number(size),
        imageUrl,
        toppings
    });
};

async function getAll() {
    const products = await Product.find({});
    const chicken = products.filter(p => p.category === 'chicken');
    const beef = products.filter(p => p.category === 'beef');
    const lamb = products.filter(p => p.category === 'lamb');

    return {
        chicken,
        beef,
        lamb
    };
}

async function getById(id) {
    const product = await Product.findById(id);
    if (!product) {
        throw new Error('Product not found.');
    }

    product.productName = getName(product.category, product.size);
    return product;
};

module.exports = {
    create,
    getAll,
    getById,
    getName
};