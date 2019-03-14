const config = require('config')
const test = require('ava')
const app = require('../../lib/app')
const logger = require('../mocks/logger')
const dbClient = require('../../lib/db')(logger)
const bootstrapDB = require('../bootstrapDB')
const request = require('superagent')

test('POST /todos : with default values', async (t) => {
  t.plan(4)

  await bootstrapDB()
  const server = app({ dbClient, logger }).listen(config.app.port)

  const response = await request
    .post('http://localhost/todos')
    .send({ title: 'Learn Javascript' })
    .catch(err => err.response)

  server.close()

  t.deepEqual(response.body.data, {
    done: false,
    id: 1,
    priority: 0,
    title: 'Learn Javascript',
  }, 'Response body should be to todo data')
  t.deepEqual(response.status, 201, 'Status code should be return 201')

  const todos = await dbClient.query('SELECT done, id, todo_priority AS priority, title FROM todos').then(res => res.rows)

  t.deepEqual(todos.length, 1, 'The number of todos in DB should be 1')
  t.deepEqual(todos[0], {
    done: false,
    id: 1,
    priority: 0,
    title: 'Learn Javascript',
  }, 'The todo data should be equal')
})

test('POST /todos : with optional values', async (t) => {
  t.plan(4)

  await bootstrapDB()
  const server = app({ dbClient, logger }).listen(config.app.port)

  const response = await request
    .post('http://localhost/todos')
    .send({
      title: 'Learn Javascript',
      done: true,
      priority: 3,
    })
    .catch(err => err.response)

  server.close()

  t.deepEqual(response.body.data, {
    done: true,
    id: 1,
    priority: 3,
    title: 'Learn Javascript',
  }, 'Response body should be to todo data')
  t.deepEqual(response.status, 201, 'Status code should be return 201')

  const todos = await dbClient.query('SELECT done, id, todo_priority AS priority, title FROM todos').then(res => res.rows)

  t.deepEqual(todos.length, 1, 'The number of todos in DB should be 1')
  t.deepEqual(todos[0], {
    done: true,
    id: 1,
    priority: 3,
    title: 'Learn Javascript',
  }, 'The todo data should be equal')
})

test('POST /todos : with invalid payload', async (t) => {
  t.plan(2)

  await bootstrapDB()
  const server = app({ dbClient, logger }).listen(config.app.port)

  const response = await request
    .post('http://localhost/todos')
    .send({
      done: true,
      priority: 3,
    })
    .catch(err => err.response)

  server.close()

  t.deepEqual(response.body, {
    error: 'AJV_INVALID_PAYLOAD',
    info: {
      errors: [
        {
          dataPath: '',
          keyword: 'required',
          message: 'should have required property \'title\'',
          params: {
            missingProperty: 'title',
          },
          schemaPath: '#/required',
        },
      ],
    },
    message: 'AJV detect an invalid payload',
  }, 'Response body should be an error with the details')
  t.deepEqual(response.status, 400, 'Status code should be return 400')
})

test('POST /todos : with database failure', async (t) => {
  t.plan(2)

  await bootstrapDB()
  const server = app({
    dbClient: {
      query: async () => {
        throw new Error('Database is down')
      },
  }, logger }).listen(config.app.port)

  const response = await request
    .post('http://localhost/todos')
    .send({ title: 'Lean Javascript' })
    .catch(err => err.response)

  server.close()

  t.deepEqual(response.body, {
    error: 'CREATE_TODO_ERROR',
    info: {
      done: false,
      priority: 0,
      title: 'Lean Javascript',
    },
    message: 'Something went wrong while inserting new todo: Database is down',
  }, 'Response body should be an error with error messages concatenated by verror module')
  t.deepEqual(response.status, 500, 'Status code should be return 500')
})
