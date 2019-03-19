const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const compress = require('koa-compress')

const errorHandler = require('./middlewares/error')
const httpLog = require('./middlewares/http-log')
const koadepsi = require('koa-depsi')

const router = require('./routes')

function createApp(dependencies = {}) {

  const app = new Koa()

  // middlewares
  app.use(koadepsi(dependencies))
  app.use(errorHandler)
  app.use(httpLog)
  app.use(compress())
  app.use(bodyparser())

  // routes
  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}

module.exports = createApp
