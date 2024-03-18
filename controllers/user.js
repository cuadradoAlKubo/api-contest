const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const {
  STATUS_CODE_OK,
  BAD_REQUEST_STATUS_CODE
} = require('../responses/responses-status')
const responses = require('../responses/response')
const User = require('../models/user');

const getUsers = async (req = request, res = response) => {
  const uid = req.uid;
  try {

    const users = await User.find()

    return responses.success(req, res, STATUS_CODE_OK, users, "done");
  } catch (error) {
    return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }

}

const getUser = async (req = request, res = response) => {
  try {
    const {
      id
    } = req.params
    const user = await User.findById(id)
    const result = {
      user
    }
    return responses.success(req, res, STATUS_CODE_OK, result, "done");
  } catch (error) {
    return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }

}

const getUserInfo = async (req = request, res = response) => {
  const uid = req.uid;
  try {
  
    const user = await User.findById(uid)
    const result = {
      user
    }
    return responses.success(req, res, STATUS_CODE_OK, result, "done");
  } catch (error) {
    return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde 2");
  }

}
const postUser = async (req = request, res = response) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const data = {
        name,
        email,
        password, 
        role
      }

      user = new User(data)

      // Encriptar la contraseña
      const salt = bcrypt.genSaltSync(); // por defecto es 10 dentro de los parentesis
      user.password = bcrypt.hashSync(password, salt);

      await user.save()
      
      return responses.success(req,res,STATUS_CODE_OK,null,'done');

    }else{
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "El usuario ya existe");
    }

  } catch (error) {
    console.log(`ERROR-AL-AGREGAR-USUARIO -- ${error}`)
    return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }
}

const updatePassword = async (req = request, res = response) => {
  const uid = req.uid;
  try {
      const {
          password,
          repeatPassword,
      } = req.body

      if (password === repeatPassword) {
          const userInfo = await User.findById(uid);
          const salt = bcrypt.genSaltSync(); // por defecto es 10 dentro de los parentesis
          userInfo.password = bcrypt.hashSync(password, salt);
          const user = await User.findByIdAndUpdate(uid, userInfo, {
              new: true
          });

          return responses.success(req,res,STATUS_CODE_OK,user,'done');

      } else {
        return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Error en la contraseña');
      }
  } catch (error) {
      console.log(error)
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }

};
const deleteUser = async (req = request, res = response) => {
  const uid = req.uid;
  const id = req.params.id
  try {
     const deletedUser = await User.findByIdAndUpdate(id,{status:false}, {new:true})
     return responses.success(req,res,STATUS_CODE_OK,deletedUser,'done');

  } catch (error) {
      console.log(error)
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }

};

const restoreUser = async (req = request, res = response) => {
  const uid = req.uid;
  const id = req.params.id
  try {
     const updatedUser = await User.findByIdAndUpdate(id,{status:true}, {new:true})
     return responses.success(req,res,STATUS_CODE_OK,updatedUser,'done');
  } catch (error) {
      console.log(error)
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }

}

const updateUser = async (req = request, res = response) => {
  const uid = req.uid;
  const id = req.params.id
  const {name, email,role, status}=req.body;

  try {
    const user = await User.findById(id);

    user.name =  name ? name : user.name;
    user.email =  email ? email : user.email;
    user.role =  role ? role : user.role;
    if(status === false){
      user.status =  false
    }else{
      user.status =  true
    }

     const updatedUser = await User.findByIdAndUpdate(id,user, {new:true})
     return responses.success(req,res,STATUS_CODE_OK,updatedUser,'done');
  } catch (error) {
      console.log(error)
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, "Algo salio mal intenta mas tarde");
  }

}

module.exports = {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  updateUser,
  updatePassword,
  restoreUser,
  getUserInfo
}
