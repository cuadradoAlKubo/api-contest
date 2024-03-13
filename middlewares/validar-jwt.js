const jwt = require('jsonwebtoken')
const { request, response } = require('express')
const User = require('../models/user')
const {
    BAD_REQUEST_STATUS_CODE
} = require('../responses/responses-status')
const responses = require("../responses/response")

const validarJWT = async (req = request, res = response, next) => {

    // const token = req.header('security-token');
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Acceso no autorizado");
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETKEY);
        console.log(uid);
        const user = await User.findById(uid)
        // Validamos que el usuario exista
        if (!user) {
            return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Token no valido - usuario no existe");
        }

        // Verificar el uid esta activo
        if (!user.status) {
            return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Token no valido - usuario desactivado");
        }
        req.uid = uid;
        req.user = user;

        next()

    } catch (error) {
        console.log(error);
        return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Acceso no autorizado");
    }




}


const comprobarJWT = async (token = '')=>{
    try {
        if( token.length < 10 ){
            return null
        }

        const {uid} = jwt.verify(token, process.env.SECRETKEY)
        const user = await User.findById(uid)
        return {uid,user}
        
    } catch (error) {
        console.log(error)
    }
}

const validarRecoveryJWT = async (req = request, res = response, next) => {

    // const token = req.header('security-token');
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Acceso no autorizado");
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETKEY);
        const user = await User.findById(uid)
        // Validamos que el usuario exista
        if (!user) {
            return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Token no valido - usuario no existe");
        }

        // Verificar el uid esta activo
        if (!user.status) {
            return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Token no valido - usuario desactivado");
        }

        return {uid, user}

    } catch (error) {
        console.log(error);
        return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Acceso no autorizado");
    }




}


module.exports = {
    validarJWT,
    comprobarJWT,
    validarRecoveryJWT
}