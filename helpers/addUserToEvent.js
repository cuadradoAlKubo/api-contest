const { Contest, UserByContest } = require('../models')
const addUserToEvent = async (contestId, discordUser) =>
{
  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return 'Contest not found';
    }
    const validateUserByContest = await UserByContest.findOne({ discordUser, contestId })
    if (validateUserByContest) {
      return 'Usuario ya registrado'
    }

    const data = {
      discordUser, contestId
    }

    const userByContest = new UserByContest(data)
     userByContest.save()
      return 'done'
    // Resto de la lógica de suscripción..
  } catch (error) {
    return error
  }
}

module.exports = {addUserToEvent}