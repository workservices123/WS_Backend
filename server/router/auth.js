const express = require('express')
const authController = require('../controllers/auth')
const md_auth = require("../middlewares/authenticated")

const api = express.Router()

api.post('/auth/register', authController.register)
api.post('/auth/login', authController.login)
api.post('/auth/refresh_access_token', authController.refreshAccesToken)
api.patch('/auth/recoverPassword', [md_auth.asureAuth], authController.recoverPassword)

module.exports = api