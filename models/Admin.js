const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const admin = new mongoose.Schema(
    {
        id: String,
        email: String,
        password: String,
    }
)

admin.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

admin.methods.validatePassword = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password)
}

module.exports = mongoose.model('Admin', admin)
