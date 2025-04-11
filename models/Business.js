const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const business = new mongoose.Schema(
    {
        id: String,
        email: String,
        password: String,
        location: String,
        district: String,
        pincode: String,
        image: String,
        storeName: {
            type: String,
            default: ''
        },
        storeDescription: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            default: ''
        }
    }
)

business.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

business.methods.validatePassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}

module.exports = mongoose.model('Business', business)
