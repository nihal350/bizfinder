const User = require('../models/User')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Business = require('../models/Business')
const createUserToken = require('../utils/createUserToken')
const crypto = require('crypto')
const Order = require('../models/Orders')
const Razorpay = require('razorpay');





exports.getSignupPage = (req, res) => {
    return res.render('user/signup', { error: '', signup: '' })
}

exports.signup = async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email })
        if (findUser) {
            return res.render('user/signup', { error: 'email already used', signup: '' })
        }
        await User.create({
            id: Date.now(),
            email: req.body.email,
            password: req.body.password
        })
        // return res.render('user/signup', { error: '', signup: 'user created, please login to continue' })
        return res.redirect('/login')
    } catch (error) {
        return res.render('user/signup', { error: 'unexpected error', signup: '' })
    }
}

exports.getLoginPage = (req, res) => {
    return res.render('user/login', { error: '', login: '' })
}

exports.login = async (req, res) => {
    try {
        var findUser = await User.findOne({ email: req.body.email })
        if (!findUser) {
            return res.render('user/login', { error: 'no user found' })
        }
        console.log(req.body.email)
        console.log(req.body.password)
        var password = await findUser.validateUserPassword(req.body.password)
        console.log(password)
        if (!password) {
            return res.render('user/login', { error: 'incorrect password' })
        }
        var token = createUserToken(req.body.email)
        return res.cookie('userToken', token, { httpOnly: true }).redirect('/')
    } catch (error) {
        console.log(error)
        return res.render('user/login', { error: 'unexpected error' })
    }
}

exports.getHomePage = async (req, res) => {
    try {
        const business = await Business.find({ status: 'active' })
    const product = await Product.find()
    return res.render('user/home', { business, product })
    } catch {
        return res.render('user/error')

    }
}

exports.getSelectStorePage = async (req, res) => {
    try {
        const business = await Business.findOne({ storeName: req.params.storename })
        const product = await Product.find({ storeName: req.params.storename })
        return res.render('user/store', { product, business })
    } catch (error) {
        return res.render('user/error')
    }
}



exports.addToCart = async (req, res) => {
    try {
        console.log(req.params)
        const product = await Product.findOne({ id: req.params.productid })
        const user = await User.findOne({ email: req.user.email })
        if (!user) {
            console.log('not added to cart')
            return res.redirect('/')
        }
        var obj = {
            id: Date.now(),
            storeName: product.storeName,
            product: product.product,
            price: product.price,
            quantity: req.body.quantity,
            category: product.category,
            total: parseInt(product.price) * parseInt(req.body.quantity),
            images: product.images
        }
        user.cart.push(obj)
        await user.save()
        return res.redirect(`/selectstore/${product.storeName}`)
    } catch (error) {
        return res.render('user/error')
    }
}

exports.getCartPage = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email })
        var total = user.cart.reduce((a, i) => {
            return parseInt(a) + parseInt(i.total)
        }, 0)
        var tax = (total / 100) * 5
        return res.render('user/cart', { products: user, total, tax })
    } catch (error) {
        return res.render('user/error')
    }
}

exports.deleteItem = async (req, res) => {
    try {
        var update = await User.updateOne(
            { email: req.user.email },
            { $pull: { cart: { id: parseInt(req.params.itemid) } } }
        )
        return res.redirect('/cart')
    } catch (error) {
        console.log(error)
        return res.render('user/error')
    }
}

exports.checkOut = (req, res) => {
    console.log(req.params.total)
    return res.redirect('/')
}

exports.getSelectedPage = async (req, res) => {
    try {
        const product = await Product.findOne({ storeName: req.params.storename, id: req.params.productid })
        return res.render('user/selected', { product })
    } catch (error) {
        return res.render('user/error')
    }
}

exports.sendOtp = (req, res) => {
    try {
        const nodemailer = require('nodemailer')
        function generateOTP() {
            return Math.floor(Math.random() * 900000) + 100000;
        }
        const OTP = generateOTP()
        let transporter = nodemailer.createTransport({
            secure: true,
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'bizfinder110@gmail.com',
                pass: 'zycrafjkkvqfumlz'
            }
        })
        let mailOptions = {
            from: 'bizfinder110@gmail.com',
            to: req.params.email,
            subject: 'BizFinder OTP',
            text: 'Hey, verify your BizFinder account using this OTP',
            html: `<h1>${OTP}</h1>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        return res.json({ otp: OTP })
    } catch (error) {
        return res.json('failed')
    }
}



exports.paymentRequest = async (req, res) => {
    let { address, total } = req.body
    let instance = new Razorpay({
        key_id: process.env.RAZOR_KEY_ID,
        key_secret: process.env.RAZOR_KEY_SECRET
    });

    const myOrder = await instance.orders.create({
        amount: total * 100,
        currency: "INR",
        // receipt: `${email}/${id}`
    });

    res.status(200).json({
        success: true,
        useremail: req.user.email,
        amount: total * 100,
        order: myOrder,
        address: address
    });
}
exports.verifyPayment = async (req, res) => {
    let { orderId, paymentId, signature, id, address } = req.body

    const hmac = crypto.createHmac("sha256", process.env.RAZOR_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    let verified = generated_signature === signature;
    if (verified) {
        const user = await User.findOne({ email: req.user.email })
        var orderCart = []
        user.cart.forEach((i) => {
            orderCart.push(i)
        })
        let options = {
            userid: user.id,
            billid: Date.now(),
            email: req.user.email,
            paymentcompleted: 'true',
            paymentid: paymentId,
            orderid: orderId,
            signature: signature,
            cart: orderCart,
            address: address
        }
        await Order.create(options)
        user.orders.push({
            userid: user.id,
            billid: Date.now(),
            email: req.user.email,
            paymentcompleted: 'true',
            paymentid: paymentId,
            orderid: orderId,
            signature: signature,
        })
        user.cart = []
        await user.save()
    }
    return res.json({ success: verified, id: id })
}

exports.success = (req, res) => {
    return res.render('user/success')
}

exports.getOrderPage = async (req, res) => {
    const user = await User.findOne({ email: req.user.email })
    const orders = await Order.find({ email: req.user.email })
    return res.render('user/orders', { user, orders })
}



exports.logout = (req, res) => {
    return res.clearCookie('userToken').redirect('/login')
}