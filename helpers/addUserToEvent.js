const { Contest, UserByContest } = require('../models')
const addUserToEvent = async (contestId, discordUser) =>
{
  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return 'Contest not found';
    }
    if (contest.contestDate < new Date()) {
      return 'Contest date expired'
    }
    if (contest.contestStatus === 'FINISHED') {
      return 'Contest closed'
    }
    if (contest.contestStatus === 'PENDING') {
      return 'Contest not started'
    }


    const validateUserByContest = await UserByContest.findOne({ discordUser, contestId })
    if (!validateUserByContest) {
      const data = {
        discordUser, contestId
      }

      const userByContest = new UserByContest(data)
      await userByContest.save()
    }


    return 'done'
  } catch (error) {
    return error
  }
}

module.exports = { addUserToEvent }