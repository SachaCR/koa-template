
const VError = require('verror')

async function get(dbClient) {
  try {
    const results = await dbClient.get()
    return results
  } catch (err) {
    const error = new VError({
      name: 'GET_ERROR',
      cause: err,
    }, 'Something went wrong while getting ressources')
    throw error
  }
}

module.exports = {
  get,
}
