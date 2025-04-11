const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const user = new mongoose.Schema(
    {
        id: String,
        email: String,
        password: String,
        cart: {
            type: Array,
            default: []
        },
        orders: {
            type: Array,
            default:[]
        }
    }
)

user.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

user.methods.validateUserPassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}

module.exports = mongoose.model('User', user)
