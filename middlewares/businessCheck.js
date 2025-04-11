const Business = require('../models/Business')
const jwt = require('jsonwebtoken')
exports.isLoggedIn = (req, res, next) => {
    var token = req.cookies.businessToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            return res.redirect('/business')
        } else {
            return res.clearCookie('businessToken').render('business/login', { error: 'unexpected error' })
        }
    } else {
        next()
    }
}

exports.validateToken = async(req, res, next) => {
    var token = req.cookies.businessToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            const finder = await Business.findOne({email : decoded.email})
            req.user = finder
            next()
        } else {
            return res.clearCookie('businessToken').render('business/login', { error: 'token error' })
        }
    } else {
        return res.clearCookie('businessToken').render('business/login', { error: 'please login to continue' })
    }
}