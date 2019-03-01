const koaValidator = require('koa-validator-ajv')

const controller = require('../../controllers/todos')

const schema = {
  id: 'createTodo',
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    priority: { type: 'integer', default: 0 },
    done: { type: 'boolean', default: false },
  },
  required: ['title']
}

async function createTodoHandler(ctx) {
  try {

    const dbClient = ctx.deps.dbClient
    const todo = await controller.createTodo(ctx.request.body, dbClient)

    ctx.status = 201
    ctx.body = { data: todo }

  } catch (err) {
    ctx.throw(err)
  }
}

module.exports = {
  validator: koaValidator.bodyValidator(schema),
  handler: createTodoHandler,
}

/**
 * @api {post} /todos Create a new Todo
 * @apiGroup todos
 * @apiName addTodo
 *
 * @apiParamExample {json} Request-Body-Example:
 * {
 *   title: 'Learn Koa', // required
 *   priority: 0, // optional default 0
 *   done: false, // optional default false
 * }
 *
 * @apiSuccessExample Success-Body-Response:
 * HTTP/1.1 201 Created
 * {
 *   id: 1
 *   title: 'Learn Koa',
 *   priority: 0,
 *   done: false,
 * }
 *
 * @apiError {String} INVALID_PAYLOAD Invalid payload
 *
 * @apiErrorExample INVALID_PAYLOAD:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     message: 'Invalid Payload',
 *     code: 'INVALID_PAYLOAD',
 *     details: [{
 *       field: '.type',
 *       reason: 'should match pattern "^SEC|FRAIS|SEMI_PULL$"'
 *     }]
 *   }
 */
