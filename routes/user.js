const { Router } = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste } = require('../helpers/db-validator')

const { validarJWT, validarCampos, tieneAcceso } = require('../middlewares');
const {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  updatePassword,
  updateUser,
  restoreUser,
  getUserInfo
} = require("../controllers/user");


const router = Router()
router.get('/user', [ validarJWT ], getUserInfo);
router.get('/', [
  validarJWT,
  tieneAcceso( "ADMIN"),
  validarCampos
], getUsers);

router.get('/:id', [ validarJWT ], getUser);


router.post('/', [
  validarJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo no es valido').isEmail(),
  check('email').custom(email => emailExiste(email)),
  tieneAcceso("SUPER_ADMIN", "ADMIN"),
  check('role').custom(role => esRoleValido(role)),
], postUser)

router.patch('/:id', [ validarJWT,
  check('password', "La contraseña es obligatoria").notEmpty(),
  validarCampos
], updatePassword)

router.delete('/:id', [
  validarJWT,
  tieneAcceso( "ADMIN"),
  validarCampos
], deleteUser);

router.patch('/restore/:id',
  [ validarJWT,
    tieneAcceso( "ADMIN"),
    validarCampos
  ], restoreUser);

router.patch('/update/:id',
  [ validarJWT,
    tieneAcceso( "ADMIN"),
    validarCampos
  ], updateUser);

module.exports = router