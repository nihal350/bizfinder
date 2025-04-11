const express = require('express')
const router = express.Router()


const { isLoggedIn, validateToken } = require('../middlewares/userCheck')
const { getLoginPage, login, getSignupPage, signup, getHomePage, logout, addToCart, getCartPage, deleteItem, checkOut, filterByCategory, filterbyBusiness, getSelectStorePage, getSelectedPage, sendOtp, paymentRequest, verifyPayment, success, getOrderPage } = require('../controllers/userController')


router
    .route('/')
    .get(validateToken, getHomePage)
router
    .route('/signup')
    .get(getSignupPage)
    .post(signup)
router
    .route('/sendotp/:email')
    .get(sendOtp)
router
    .route('/login')
    .get(isLoggedIn, getLoginPage)
    .post(login)
router
    .route('/selectstore/:storename')
    .get(getSelectStorePage)
router
    .route('/addtocart/:productid')
    .post(validateToken, addToCart)
router
    .route('/cart')
    .get(validateToken, getCartPage)
router
    .route('/deleteitem/:itemid')
    .get(validateToken, deleteItem)
router
    .route('/selectedproduct/:storename/:productid')
    .get(getSelectedPage)
router
    .route('/cart')
    .get(validateToken, getCartPage)
router
    .route('/checkout/:total')
    .get(validateToken, checkOut)
router
    .route('/payment')
    .post(validateToken, paymentRequest)
router
    .route('/verifypayment')
    .post(validateToken, verifyPayment)
router
    .route('/success')
    .get(validateToken, success)
router
    .route('/orders')
    .get(validateToken, getOrderPage)
router
    .route('/logout')
    .get(logout)


module.exports = router