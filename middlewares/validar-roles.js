const {request, response} = require('express')
const responses = require("../responses/response")
const { SERVER_ERROR_CODE, UNAUTHORIZED_STATUS_CODE } = require('../responses/responses-status')

const isAdmin = (req = request, res = response, next ) => {
    
    if (!req.user) {
      return responses.error(req, res, SERVER_ERROR_CODE, null, "Acceso no autorizado");
        return res.status(500).json({
            msg: "Se quiere verificar el rol sin validar el token "
        })
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN') {
      return responses.error(req, res, UNAUTHORIZED_STATUS_CODE, null, "Acceso no autorizado");
    }

    next()
}

const tieneAcceso = (...roles) => {
    
    return (req = request, res = response, next) => {
        if (!req.user) {
          return responses.error(req, res, UNAUTHORIZED_STATUS_CODE, null, "Acceso no autorizado");
        }
        if (!roles.includes(req.user.role)) {
          return responses.error(req, res, UNAUTHORIZED_STATUS_CODE, null, "Acceso no autorizado");
        }
        
        next()
    }
}

module.exports = {
    isAdmin,
    tieneAcceso
}