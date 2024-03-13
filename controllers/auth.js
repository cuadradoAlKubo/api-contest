const { request, response } = require('express')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const {
  generarJWT
} = require('../helpers/jwt-generator')
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
  BAD_REQUEST_STATUS_CODE
} = require('../responses/responses-status')
const responses = require("../responses/response")

const login = async (req = request, res = response) =>
{
  const { email, password } = req.body;

  try {

    // Verificar si el email existe
    const user = await User.findOne({ email })

    if (!user) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, 'Usuario/ Password no son correctos - Correo')
    }

    // Verificar si el usuario esta activo
    if (!user.status) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, 'Usuario/ Password no son correctos - status')
    }

    // Verificar la contraseña

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, 'Usuario/ Password no son correctos - password')
    }

    // Generar JWT

    const token = await generarJWT(user.id, user.role)

    return responses.success(req, res, STATUS_CODE_OK, { user, token }, 'Login exitoso')

  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Algo salio mal')
  }


}


module.exports = {
  login
}