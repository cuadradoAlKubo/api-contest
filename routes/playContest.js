const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, isAdmin } = require('../middlewares');
const { createRound, playRound } = require('../controllers/playContest');
const router = Router()

router.post('/create', [
  validarJWT,
  isAdmin,
  check('contestId', 'ContestId is not a valid Mongo ID').isMongoId(),
  check('round', 'Round is required').notEmpty(),
  validarCampos
],
createRound)

router.get('/play/:roundId', [
  validarJWT,
  isAdmin,
  validarCampos ],
  playRound)



module.exports = router