const { Router } = require('express');
const { check } = require('express-validator');


const { collectionAvailable } = require('../helpers/db-validator')
const {
  getImage,
  updateFileCloudinary,
  uploadFileCloudinary,
  deleteFileCloudinary
} = require('../controllers/uploads');
const { validarJWT, validarArchivo, validarCampos } = require('../middlewares');

const router = Router()

router.post('/:collection/:id', [ validarJWT, validarArchivo,  validarCampos ], uploadFileCloudinary)

router.put('/:collection/:id', [
  validarArchivo,
  check('id', 'Debe de ser un id valido').isMongoId(),
  check('collection').custom(c => collectionAvailable(c, [ 'prizes', 'contest' ])),
  validarCampos
], updateFileCloudinary)

router.delete('/:collection/:id', deleteFileCloudinary)


module.exports = router