const { validationResult } = require('express-validator')
const {
  BAD_REQUEST_STATUS_CODE
} = require('../responses/responses-status')
const responses = require("../responses/response")

const validarCampos = (req, res, next) =>
{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responses.error(req, res, BAD_REQUEST_STATUS_CODE, errors, errors);
  }

  next();
}

// const validarCampos = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//       return res.status(400).json(errors);
//   }

//   next();
// }

module.exports = {
  validarCampos
}