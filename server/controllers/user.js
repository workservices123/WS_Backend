const User = require("../models/user")
const bcrypt = require("bcryptjs")
const image = require("../utils/image")

function createUsers(req, res){
    const { password } = req.body
    const user = new User({...req.body, active: true})

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)
    user.password = hashPassword

    if(req.files.avatar){
        const imagePath = image.getFilePath(req.files.avatar)
        user.avatar = imagePath
    }
    user.save((error, userStored) => {
        if(error){
            res.status(400).send({msg: "Error al crear usuario"})
        } else {
            res.status(200).send(userStored)
        }
    })
}

module.exports = {
    createUsers,
}