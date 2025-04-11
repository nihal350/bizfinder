const jwt = require('jsonwebtoken')

const createToken = (email) => {
    return jwt.sign({
        email : email
    }, process.env.JWT_SECRET)
}

module.exports = createToken