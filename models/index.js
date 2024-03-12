const User = require('../models/user');
const Contest = require('./contest');
const Prize = require('../models/prize');
const UserByContest = require('./userByContest');
const Round = require('../models/round');
module.exports = {
  User,
  Contest,
  Prize,
  UserByContest,
  Round
}