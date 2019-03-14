const config = require('config')
const test = require('ava')
const app = require('../../lib/app')
const logger = require('../mocks/logger')
const dbClient = require('../../lib/db')(logger)
const bootstrapDB = require('../bootstrapDB')
const request = require('superagent')

test('POST /notFound', async (t) => {
  t.plan(2)

  await bootstrapDB()
  const server = app({ dbClient, logger }).listen(config.app.port)

  const response = await request.get('http://localhost/notFound').catch(err => err.response)
  server.close()


  t.deepEqual(response.text, 'Not Found', 'Response text should be "Not Found"')
  t.deepEqual(response.status, 404, 'Status code should be return 404')
})
