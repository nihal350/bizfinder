const jwt = require('jsonwebtoken')
exports.isLoggedIn = (req, res, next) => {
    var token = req.cookies.userToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            return res.redirect('/')
        } else {
            return res.clearCookie('userToken').render('user/login', { error: 'unexpected error' })
        }
    } else {
        next()
    }
}

exports.validateToken = (req, res, next) => {
    var token = req.cookies.userToken
    if (token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) {
            req.user = decoded
            next()
        } else {
            return res.clearCookie('userToken').render('user/login', { error: 'token error' })
        }
    } else {
        return res.clearCookie('userToken').render('user/login', { error: 'please login to continue' })
    }
}