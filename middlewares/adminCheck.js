const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')
exports.isLoggedIn = (req, res, next) => {
    var token = req.cookies.adminToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            return res.redirect('/admin')
        } else {
            return res.clearCookie('AdminToken').render('admin/login', { error: 'unexpected error' })
        }
    } else {
        next()
    }
}

exports.validateToken = async (req, res, next) => {
    var token = req.cookies.adminToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            const finder = await Admin.findOne({ email: decoded.email })
            req.user = finder
            next()
        } else {
            return res.clearCookie('adminToken').render('admin/login', { error: 'token error' })
        }
    } else {
        return res.clearCookie('adminToken').render('admin/login', { error: 'please login to continue' })
    }
}