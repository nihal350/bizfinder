const Admin = require('../models/Admin')
const Business = require('../models/Business')
const Category = require('../models/Category')
const createAdminToken = require('../utils/createAdminToken')


exports.getSignupPage = (req, res) => {
    return res.render('admin/signup', { error: '', signup: '' })
}

exports.signup = async (req, res) => {
    try {
        const findUser = await Admin.findOne({ email: req.body.email })
        if (findUser) {
            return res.render('admin/signup', { error: 'email already used', signup: '' })
        }
        await Admin.create({
            id: Date.now(),
            email: req.body.email,
            password: req.body.password,
        })
        // return res.render('admin/signup', { error: '', signup: 'admin created, please login to continue' })
        return res.redirect('/admin/login')
    } catch (error) {
        return res.render('admin/signup', { error: 'unexpected error', signup: '' })
    }
}

exports.getLoginPage = (req, res) => {
    return res.render('admin/login', { error: '' })
}

exports.login = async (req, res) => {
    try {
        var findUser = await Admin.findOne({ email: req.body.email })
        if (!findUser) {
            return res.render('admin/login', { error: 'no admin found' })
        }
        var password = await findUser.validatePassword(req.body.password)
        if (!password) {
            return res.render('admin/login', { error: 'incorrect password' })
        }
        var token = createAdminToken(req.body.email)
        return res.cookie('adminToken', token, { httpOnly: true }).redirect('/admin')
    } catch (error) {
        console.log(error)
        return res.render('admin/login', { error: 'unexpected error' })
    }
}

exports.getHomePage = async (req, res) => {
    try {
        const finder = await Category.find()
        return res.render('admin/home', { error: '', msg: '', user: req.user, category: finder })
    } catch (error) {
        return res.render('user/error')
    }
}

exports.createCategory = async (req, res) => {
    try {
        const oldCategory = await Category.find()
        const finder = await Category.findOne({ category: req.body.category })
        if (finder) {
            return res.render('admin/home', { error: 'category already exist', msg: '', user: req.user, category: oldCategory })
        }
        await Category.create({
            id: Date.now(),
            category: req.body.category,
            createdby: req.user.id
        })
        const newCategory = await Category.find()
        return res.render('admin/home', { error: '', msg: 'category created', user: req.user, category: newCategory })
    } catch (error) {
        const category = await Category.find()
        return res.render('admin/home', { error: 'unexpected error', msg: '', user: req.user, category: category })
    }
}

exports.getApprovePage = async (req, res) => {
    try {
        const business = await Business.find({ status: 'pending' })
        return res.render('admin/approve', { business })
    } catch (error) {
        return res.render('admin/error')
    }
}

exports.approveBusiness = async (req, res) => {
    try {
        const business = await Business.findOne({ id: req.params.id })
        business.status = 'active'
        await business.save()
        return res.redirect('/admin/approvebusiness')
    } catch (error) {
        return res.render('admin/error')
    }
}

exports.getBusinessPage = async (req, res) => {
    try {
        const business = await Business.find()
        return res.render('admin/business', { business })
    } catch (error) {
        return res.render('admin/error')
    }
}

exports.logout = (req, res) => {
    return res.clearCookie('adminToken').redirect('/admin/login')
}