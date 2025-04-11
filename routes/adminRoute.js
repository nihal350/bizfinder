const express = require('express')
const router = express.Router()

const { isLoggedIn, validateToken } = require('../middlewares/adminCheck')
const { getLoginPage, getSignupPage, signup, login, getHomePage, logout, createCategory, getApprovePage, approveBusiness, getBusinessPage } = require('../controllers/adminController')


router
    .route('/')
    .get(validateToken, getHomePage)
router
    .route('/signup')
    .get(getSignupPage)
    .post(signup)
router
    .route('/login')
    .get(isLoggedIn, getLoginPage)
    .post(login)
router
    .route('/createcategory')
    .post(validateToken, createCategory)
router
    .route('/approvebusiness')
    .get(getApprovePage)
router
    .route('/approvebusiness/:id')
    .get(approveBusiness)
router
    .route('/business')
    .get(getBusinessPage)
router
    .route('/logout')
    .get(logout)


module.exports = router