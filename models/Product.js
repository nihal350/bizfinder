const mongoose = require('mongoose')

const product = new mongoose.Schema(
    {
        id: String,
        storeName: String,
        product: String,
        price: String,
        description: String,
        quantity: String,
        category: String,
        images: {
            type: Array,
            default: []
        }
    }
)

module.exports = mongoose.model('Product', product)
