
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');
const { model } = require('mongoose');
const { uploadFile } = require('../helpers/upload-file')
const { Prize, Contest } = require('../models')
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
} = require('../responses/responses-status');
const responses = require("../responses/response");

// Carga la imagen de perfil, logo del cliente y los productos en cloudinary
const uploadFileCloudinary = async (req = request, res = response) =>
{
  const { tempFilePath } = req.files.file
  const { id, collection } = req.params

  let modelo;

  switch (collection) {
    case 'prizes':
      modelo = await Prize.findById(id)
      if (!modelo) {
        return responses.error(req, res, SERVER_ERROR_CODE, 'Premio no encontrado');
      }

      break;
    case 'contest':
      modelo = await Contest.findById(id)
      if (!modelo) {
        return responses.error(req, res, SERVER_ERROR_CODE, 'Sorteo no encontrado');
      }

      break;

    default:
      return responses.error(req, res, SERVER_ERROR_CODE, 'No esta validado');
      break;
  }
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
  modelo.image = secure_url;

  await modelo.save()
  return responses.success(req, res, STATUS_CODE_OK, secure_url, 'Imagen subida');

}

const deleteFileCloudinary = async (req = request, res = response) =>
{
  const { id, collection } = req.params
  let modelo;

  switch (collection) {
    case 'prizes':
      modelo = await Prize.findById(id)
      if (!modelo) {
        return responses.error(req, res, SERVER_ERROR_CODE, 'Premio no encontrado');
      }

      break;
    case 'contest':
      modelo = await Contest.findById(id)
      if (!modelo) {
        return responses.error(req, res, SERVER_ERROR_CODE, 'Sorteo no encontrado');
      }

      break;

    default:
      return responses.error(req, res, SERVER_ERROR_CODE, 'No esta validado');
      break;
  }

  const nombreArr = modelo.image.split('/');
  const nombre = nombreArr[ nombreArr.length - 1 ];
  const [ public_id ] = nombre.split('.')
  await cloudinary.uploader.destroy(public_id)
  switch (collection) {
    case 'prizes':
      await Prize.findByIdAndUpdate(id, { image: '' }, { new: true })

      break;
    case 'contest':
      findByIdAndUpdate(id, { image: '' }, { new: true })

      break;

    default:
      return responses.error(req, res, SERVER_ERROR_CODE, 'No esta validado');
      break;
  }
  return responses.success(req, res, STATUS_CODE_OK, 'Imagen eliminada', 'Imagen eliminada');
}

// Carga y actualiza la imagen de perfil, logo del cliente y los productos en cloudinary
const updateFileCloudinary = async (req = request, res = response) =>
{
  const { id, collection } = req.params


  let modelo;

  switch (collection) {
    case 'prizes':
      modelo = await Prize.findById(id)
      if (!modelo) {
        return responses.error(req, res, SERVER_ERROR_CODE, 'Premio no encontrado');
      }

      break;
    case 'contest':
      modelo = await Contest.findById(id)
      if (!modelo) {
        return responses.error(req, res, SERVER_ERROR_CODE, 'Sorteo no encontrado');
      }

      break;

    default:
      return responses.error(req, res, SERVER_ERROR_CODE, 'No esta validado');
      break;
  }

  // Limpiar imagenes previas

  if (modelo.image) {
    // Borrar imagen del cloudinary
    const nombreArr = modelo.image.split('/');
    const nombre = nombreArr[ nombreArr.length - 1 ];
    const [ public_id ] = nombre.split('.')
    cloudinary.uploader.destroy(public_id)

  }
  const { tempFilePath } = req.files.file

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

  // const name = await uploadFile(req.files, undefined, collection);
  modelo.image = secure_url;

  await modelo.save()

  return responses.success(req, res, STATUS_CODE_OK, modelo, 'Imagen actualizada');
}


module.exports = {
  uploadFileCloudinary,
  updateFileCloudinary,
  deleteFileCloudinary
}