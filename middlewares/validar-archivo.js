const {request, response} = require('express-validator')
const responses = require("../responses/response")
const { BAD_REQUEST_STATUS_CODE } = require('../responses/responses-status')

const validarArchivo = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file ) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "No hay archivos que subir - validar-archivo");
    }

    next()
}

module.exports = {
    validarArchivo
}