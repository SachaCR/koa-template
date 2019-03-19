const Router = require('koa-router')
const controller =require('../controllers')

const router = new Router()

async function handler(ctx) {
  try {
    const result = await controller.get()
    ctx.body = {
      data: result
    }
  } catch (err) {
    if (err.name === 'GET_ERROR') {
      ctx.throw(503, err)
    }

    ctx.throw(err)
  }
}

router.get('/', handler)

module.exports = router

/**
 * @api {get} / Get
 * @apiGroup get
 * @apiName get
 *
 * @apiSuccessExample Success-Body-Response:
 * HTTP/1.1 200 OK
  {
    data: {}
  }
 *
 *
 */
