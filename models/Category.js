const mongoose = require('mongoose')

const category = new mongoose.Schema(
    {
        id: String,
        category: String,
        createdby: String
    }
)

module.exports = mongoose.model('Category', category)
