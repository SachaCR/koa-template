const url = require('url')
const config = require('config')
const request = require('superagent')

const IMS_HOST = config.services.ims.host
const IMS_PROTOCOL = config.services.ims.protocol

const INVENTORY_SERVICE_UNREACHABLE = 'INVENTORY_SERVICE_UNREACHABLE'

function errorHandler(err) {
  if (err.code === 'ECONNREFUSED') {
    const error = new Error('Inventory service is unreachable')
    error.status = 503
    error.code = INVENTORY_SERVICE_UNREACHABLE
    throw error
  }

  throw err
}

async function sampleCallToInventory(data) {
  const requestURL = url.format({
    protocol: IMS_PROTOCOL,
    hostname: IMS_HOST,
    pathname: '/sample/path',
  })

  try {
    const response = await request.post(requestURL).send(data)
    return response
  } catch (err) {
    errorHandler(err)
  }
}

module.exports = {
  sampleCallToInventory,
}
