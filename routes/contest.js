const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, isAdmin } = require('../middlewares');
const { createContest, getContests, getContestById, updateContest, deleteContest } = require('../controllers/contest');
const router = Router()

router.get('/', [
  validarJWT,
  isAdmin,
  validarCampos
],
  getContests)

router.post('/create', [
  validarJWT,
  isAdmin,
  check('name', 'Name is required').notEmpty(),
  check('rounds', 'rounds is required').notEmpty(),
  check('contestDate', 'contestDate is required').notEmpty(),
  validarCampos ],
  createContest)

module.exports = router