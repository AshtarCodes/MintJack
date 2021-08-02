const express = require('express')
const router = express.Router()
const getController = require('../controllers/get')
const authController = require('../controllers/auth')
const { ensureAuth, ensureGuest } = require('../middleware/auth')


router.get('/', getController.getIndex)
router.get('/loggedInUser', getController.getLoggedInUser)
router.get('/logout', authController.logout)






module.exports = router