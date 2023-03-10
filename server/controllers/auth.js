const bcrypt = require('bcryptjs')
const User = require('../models/user')

const jwt = require('../utils/jwt')

function register(req, res){
    const {firstname, lastname, email, password} = req.body

    if(!email) res.status(400).send({msg: "El email es obligario"})
    if(!password) res.status(400).send({msg: "La constraseña es obligatoria"})

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false,
        password
    })

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)
    user.password = hashPassword

    user.save((error, userStorage) => {
        if (error) {
            res.status(400).send({msg: "Error al crear usuario"})
        } else {
            res.status(200).send(userStorage)
        }
    })
}

function login(req, res){
    const { email, password } = req.body

    if(!email) res.status(400).send({msg: "El email es obligatorio"})
    if(!password) res.status(400).send({msg: "La contraseña es obligatoria"})

    const emailLowerCase = email.toLowerCase()

    User.findOne({ email: emailLowerCase }, (error, userStore)=>{
        if(error){
            res.status(401).send({msg: "Error del servidor"})
        }else{
            bcrypt.compare(password, userStore.password, (bcryptError, check)=>{
                if(bcryptError){
                    res.status(500).send({msg: "Error del servidor"})
                }else if(!check){
                    res.status(400).send({msg: "Contraseña incorrecta"})
                }else if(!userStore.active){
                    res.status(401).send({msg: "Usuario no autorizado"})
                }else{
                    res.status(200).send({
                        access: jwt.createAccesToken(userStore),
                        refresh: jwt.createRefreshToken(userStore)
                    })
                }
            })
        }
    })
}

function recoverPassword(req, res){
    const recoverData = req.body

    if(recoverData.password){
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(recoverData.password, salt)
        recoverData.password = hashPassword
    }else{
        delete recoverData.password
    }

    if(!recoverData.email) res.status(400).send({msg: "Debe ingresar el email"})
    const emailLowerCase = recoverData.email.toLowerCase()

    User.findOneAndUpdate({email: emailLowerCase}, recoverData.password, (error)=>{
        if(error){
            res.status(401).send({msg: "Error del servidor"})
        }else{
            res.status(200).send(recoverData.password)
        }
    })
}

function refreshAccesToken(req, res){
    const { token } = req.body

    if(!token) res.status(400).send({msg: "Token requerido"})

    const { user_id } = jwt.decoded(token)

    User.findOne({_id: user_id}, (error, userStorage)=>{
        if(error){
            res.status(400).send({msg: "Error del servidor"})
        }else{
            res.status(200).send({accessToken: jwt.createAccesToken(userStorage)})
        }
    })
}


module.exports = {
    register,
    login,
    refreshAccesToken,
    recoverPassword,
}