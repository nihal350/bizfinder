const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const order = new mongoose.Schema(
    {
        userid: String,
        billid: String,
        email: String,
        paymentcompleted:String,
        paymentid: String,
        orderid: String,
        signature: String,
        address: String,
        cart: {
            type: Array,
            default: []
        },
    }
)

module.exports = mongoose.model('Order', order)
