const {
  Role ,
  User,
} = require('../models');


const esRoleValido = async (role = '') => {
 const existeRole = await Role.findOne({ role });
 if (!existeRole) {
     throw new Error(`El rol ${ role } no está registrado en la BD`)
 }
}

const emailExiste = async (email = "") => {
 const emailExist = await User.findOne({ email });
 if (emailExist) {
     throw new Error(`El email ${ email } ya está registrado en la BD`)
 }
}

const existeUsuarioPorId = async (id = "") => {
 const existeUsuario = await User.findById(id);
 if ( !existeUsuario) {
     throw new Error(`El id ${ id } no existe`)
 }
}


const collectionAvailable = async (collection = '', collections = []) => {
  const incluida = collections.includes(collection);
  if (!incluida) {
      throw new Error(`La colección ${collection} no esta permitida - ${collections} `);
  }
  return true
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  collectionAvailable
}