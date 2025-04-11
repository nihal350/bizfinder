const express = require('express')
const router = express.Router()

const { isLoggedIn, validateToken} = require('../middlewares/businessCheck')
const { getLoginPage, getSignupPage, signup, login, getHomePage, applyForStore, logout, addProduct, getProductPage } = require('../controllers/businessController')


router
    .route('/')
    .get(validateToken, getHomePage)
router
    .route('/login')
    .get(isLoggedIn, getLoginPage)
    .post(login)
router
    .route('/signup')
    .get(getSignupPage)
    .post(signup)
router
    .route('/applyforstore')
    .post(validateToken, applyForStore)
router
    .route('/addproduct')
    .post(validateToken, addProduct)
router  
    .route('/product')
    .get(validateToken,getProductPage)
router
    .route('/logout')
    .get(logout)


module.exports = router