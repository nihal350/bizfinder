const Business = require('../models/Business')
const Product = require('../models/Product')
const Category = require('../models/Category')
const createBusinessToken = require('../utils/createBusinessToken')
const cloudinary = require('cloudinary').v2

exports.getSignupPage = (req, res) => {
    return res.render('business/signup', { error: '', signup: '' })
}

exports.signup = async (req, res) => {
    try {
        const findUser = await Business.findOne({ email: req.body.email })
        if (findUser) {
            return res.render('business/signup', { error: 'email already used', signup: '' })
        }
       const uploadResult = await cloudinary.uploader.upload(req.files.image.tempFilePath)
        await Business.create({
            id: Date.now(),
            email: req.body.email,
            password: req.body.password,
            location: req.body.location,
            district: req.body.district,
            pincode: req.body.pincode,
            image: uploadResult.url
        })
        // return res.render('business/signup', { error: '', signup: 'business created, please login to continue' })
        return res.redirect('/business/login')
    } catch (error) {
        return res.render('business/signup', { error: 'unexpected error', signup: '' })
    }
}

exports.getLoginPage = (req, res) => {
    return res.render('business/login', { error: '' })
}

exports.login = async (req, res) => {
    try {
        var findUser = await Business.findOne({ email: req.body.email })
        if (!findUser) {
            return res.render('business/login', { error: 'no business found' })
        }
        var password = await findUser.validatePassword(req.body.password)
        if (!password) {
            return res.render('business/login', { error: 'incorrect password' })
        }
        var token = createBusinessToken(req.body.email)
        return res.cookie('businessToken', token,{ httpOnly: true }).redirect('/business')
    } catch (error) {
        console.log(error)
        return res.render('business/login', { error: 'unexpected error' })
    }
}

exports.getHomePage = async (req, res) => {
    try {
        const category = await Category.find()
    return res.render('business/home', { error: '', user: req.user, category })
    } catch (error) {
        return res.render('business/error')
    }
}

exports.applyForStore = async (req, res) => {
    const category = await Category.find()
    try {
        const finder = await Business.findOne({ storeName: req.body.storeName })
        if (finder) {
            return res.render('business/home', { error: 'business name already taken', user: req.user, category })
        }
        const findUser = await Business.findOne({ email: req.user.email })
        findUser.storeName = req.body.storeName
        findUser.storeDescription = req.body.storeDescription
        findUser.status = 'pending'
        await findUser.save()
        return res.render('business/home', { error: '', user: findUser, category })
    } catch (error) {
        console.log(error)
        return res.render('business/error')
    }
}

exports.addProduct = async (req, res) => {
    const category = await Category.find()
    try {
        const finder = await Product.findOne({ storeName: req.user.storeName, product: req.body.product })
        if (finder) {
            return res.render('business/home', { error: 'product already exists', user: req.user, category })
        }
        var images = []
        for (i in req.files.images) {
            const uploadResult = await cloudinary.uploader.upload(req.files.images[i].tempFilePath)
            images.push(uploadResult.url)
        }
        await Product.create({
            id: Date.now(),
            storeName: req.user.storeName,
            product: req.body.product,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            category: req.body.category,
            images: images
        })
        return res.render('business/home', { error: 'product added', user: req.user, category })
    } catch (error) {
        console.log(error)
        return res.render('business/error')
    }
}

exports.getProductPage = async (req, res) => {
    try {
        const product = await Product.find({ storeName: req.user.storeName })
        return res.render('business/product', {product})
    } catch (error) {
        return res.render('business/error')
    }
}


exports.logout = (req, res) => {
    return res.clearCookie('businessToken').redirect('/business/login')
}