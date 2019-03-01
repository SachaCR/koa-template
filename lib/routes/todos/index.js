const Router = require('koa-router')
const createTodo = require('./createTodo')

const router = new Router({ prefix: '/todos' })

router.post('/', createTodo.validator, createTodo.handler)

module.exports = router
