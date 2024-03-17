const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, isAdmin } = require('../middlewares');
const { createContest, getContests, getContestById, updateContest, deleteContest, promotionContest } = require('../controllers/contest');
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

router.get('/:contestId', [],
  getContestById)

router.get('/promotion/:contestId', [
  validarJWT,
  isAdmin,
  validarCampos
],
  promotionContest)

router.put('/:contestId', [
  validarJWT,
  isAdmin,
  check('name', 'Name is required').notEmpty(),
  check('rounds', 'rounds is required').notEmpty(),
  check('contestDate', 'contestDate is required').notEmpty(),
  validarCampos ],
  updateContest)

router.delete('/:contestId', [ validarJWT, isAdmin, validarCampos ], deleteContest)

module.exports = router