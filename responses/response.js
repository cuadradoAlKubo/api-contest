const {STATUS_CODE_OK, BAD_REQUEST_STATUS_CODE } = require('./responses-status')

const success = (req, res, status, payload, message = 'done')=>{
  if(payload){
    return res.status(status || STATUS_CODE_OK ).json({
      status: status || STATUS_CODE_OK,
      error: false,
      msg:message,
      payload: payload
    })
  }
  
  return res.status(status || STATUS_CODE_OK ).json({
    status: status || STATUS_CODE_OK,
    error: false,
    msg:message,
    payload: []
  })
}

const error = (req, res, status, payload, message = 'error')=>{
  return res.status(status || BAD_REQUEST_STATUS_CODE ).json({
    status: status || STATUS_CODE_OK,
    error: true,
    msg:message,
    payload: []
  })
}

module.exports = {
  success,
  error
}