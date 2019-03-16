const Router = require('koa-router')
const createTodo = require('./createTodo')
const deleteTodos = require('./deleteTodos')

const router = new Router({ prefix: '/todos' })

router.post('/', createTodo.validator, createTodo.handler)
router.delete('/', deleteTodos.validator, deleteTodos.handler)

module.exports = router
