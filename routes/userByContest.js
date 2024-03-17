const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, isAdmin } = require('../middlewares');
const { subscribeToContest } = require('../controllers/userByContest');
const router = Router()


router.post('/:contestId', [],
  subscribeToContest)

router.get('/:contestId', [
  validarJWT,
  isAdmin,
  validarCampos
],
subscribeToContest)


module.exports = router