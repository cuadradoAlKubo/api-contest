const { Router } = require('express');
const { check } = require('express-validator');
const {getPrizes, createPrize, getPrizesByContest, getPrizeById, updatePrize, deletePrize } = require('../controllers/prize');
const { validarCampos, validarJWT, isAdmin } = require('../middlewares');

const router = Router()

router.post('/create', [
  validarJWT,
  isAdmin,
  check('name', 'Name is required').notEmpty(),
  // check('contestId', 'ContestId is not a valid Mongo ID').isMongoId(),
  check('orderToLot', 'OrderToLot is required').notEmpty(),
  validarCampos ],
  createPrize)

router.get('/', [], getPrizes);
router.get('/contest/:contestId', [], getPrizesByContest);
router.get('/:prizeId', [], getPrizeById);
router.put('/:prizeId', [
  validarJWT,
  isAdmin,
  check('name', 'Name is required').notEmpty(),
  check('orderToLot', 'OrderToLot is required').notEmpty(),
  validarCampos ],
  updatePrize)
router.delete('/:prizeId', [ validarJWT, isAdmin ], deletePrize)

module.exports = router