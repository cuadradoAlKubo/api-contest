const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, isAdmin } = require('../middlewares');
const { suscriptToContest } = require('../controllers/userByContest');
const router = Router()


router.post('/', [
  validarCampos ],
  suscriptToContest)

router.get('/:contestId', [
  validarJWT,
  isAdmin,
  validarCampos
],
suscriptToContest)


module.exports = router