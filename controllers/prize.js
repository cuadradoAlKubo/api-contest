const { request, response } = require('express')
const { Prize } = require('../models')
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
  BAD_REQUEST_STATUS_CODE
} = require('../responses/responses-status')
const responses = require("../responses/response")

const createPrize = async (req = request, res = response) =>
{
  const { name, description, contestId, orderToLot } = req.body;
  try {
    const prize = new Prize({ name, description, contestId, orderToLot })
    await prize.save()
    return responses.success(req, res, STATUS_CODE_OK, prize, 'Prize created')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const getPrizes = async (req = request, res = response) =>
{
  try {
    const prizes = await Prize.find().populate('contestId', 'name')
    return responses.success(req, res, STATUS_CODE_OK, prizes, 'Prizes found')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}
const getPrizesByContest = async (req = request, res = response) =>
{
  const { contestId } = req.params
  try {
    const prizes = await Prize.find({ contestId })
    return responses.success(req, res, STATUS_CODE_OK, prizes, 'Prizes found')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const getPrizeById = async (req = request, res = response) =>
{
  const { prizeId } = req.params
  try {
    const prize = await Prize.findById(prizeId)
    return responses.success(req, res, STATUS_CODE_OK, prize, 'Prize found')
  } catch (error) {
    console.log(error)
    return responses.error(res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const updatePrize = async (req = request, res = response) =>
{
  const { prizeId } = req.params
  const { name, description, orderToLot, contestId } = req.body
  try {
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, 'Prize not found')
    }
    prize.name = name
    prize.description = description
    prize.contestId = contestId
    prize.orderToLot = orderToLot
    await Prize.findByIdAndUpdate(prizeId, prize, { new: true });
    return responses.success(req, res, STATUS_CODE_OK, prize, 'Prize updated')
  }
  catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const deletePrize = async (req = request, res = response) =>
{
  const { prizeId } = req.params
  try {
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, 'Prize not found')
    }
    await Prize.findByIdAndUpdate(prizeId, {status:true}, { new: true });
    return responses.success(req, res, STATUS_CODE_OK, prize, 'Prize deleted')
  }
  catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}


module.exports = {
  createPrize,
  getPrizesByContest,
  getPrizes,
  getPrizeById,
  updatePrize,
  deletePrize
}