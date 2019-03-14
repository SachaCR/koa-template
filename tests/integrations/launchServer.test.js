const config = require('config')
const test = require('ava')
const app = require('../../lib/app')

test('Launch server with no dependencies injected', async (t) => {
  const server = app().listen(config.app.port)
  server.close()
  t.pass()
})
