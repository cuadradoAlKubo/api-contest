const { request, response } = require('express')
const { Contest } = require('../models')
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
  BAD_REQUEST_STATUS_CODE
} = require('../responses/responses-status')
const responses = require("../responses/response")

const createContest = async (req = request, res = response) =>{
  const userId = req.uid
  const { name,  rounds, contestDate } = req.body;
  try {
    const data ={ name, rounds, contestDate, createdBy: userId}
    const contest = new Contest(data)
    await contest.save()
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest created')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const getContests = async (req = request, res = response) =>{
  try {
    const contests = await Contest.find()
    return responses.success(req, res, STATUS_CODE_OK, contests, 'Contests found')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const getContestById = async (req = request, res = response) =>{
  const { contestId } = req.params
  try {
    const contest = await Contest.findById(contestId)
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest found')
  } catch (error) {
    console.log(error)
    return responses.error(res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const updateContest = async (req = request, res = response) =>{
  const { contestId } = req.params
  const { name, rounds, contestDate } = req.body
  try {
    const contest = await Contest.findById(contestId)
    if(!contest){
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    contest.name = name
    contest.rounds = rounds
    contest.contestDate = contestDate
    await Contest.findByIdAndUpdate(contestId, contest, {new: true})
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest updated')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const deleteContest = async (req = request, res = response) =>{
  const { contestId } = req.params
  try {
    const contest = await Contest.findById(contestId)
    if(!contest){
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    await Contest.findByIdAndUpdate(contestId, {status:false}, {new: true})
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest deleted')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

module.exports = {
  createContest,
  getContests,
  getContestById,
  updateContest,
  deleteContest
}