const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const { API_VERSION } = require("./constants")

const app = express()

//import routings
const authRoutes = require('./router/auth')

//Configuracion de body parser: esto para enviar json en el body
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//configure static folder
app.use(express.static("uploads"))

//cors: para que no de problemas hacer peticiones http
app.use(cors())


//configuracion de routing
app.use(`/api/${API_VERSION}`, authRoutes)

module.exports = app

