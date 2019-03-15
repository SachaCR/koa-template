const config = require('config')
const assert = require('assert')
const app = require('../../lib/app')
const logger = require('../mocks/logger')
const bootstrapDB = require('../mocks/bootstrapDB')
const request = require('superagent')

describe('POST /todos', async () => {

  it('Should create a todo with default values', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request
      .post('http://localhost/todos')
      .send({ title: 'Learn Javascript' })
      .catch(err => err.response)

    server.close()

    assert.deepEqual(response.body.data, {
      done: false,
      id: 1,
      priority: 0,
      title: 'Learn Javascript',
    }, 'Response body should be equal to todo data')
    assert.deepEqual(response.status, 201, 'Status code should be 201')

    const todos = await dbClient.query('SELECT done, id, todo_priority AS priority, title FROM todos').then(res => res.rows)

    assert.deepEqual(todos.length, 1, 'The number of todos in DB should be 1')
    assert.deepEqual(todos[0], {
      done: false,
      id: 1,
      priority: 0,
      title: 'Learn Javascript',
    }, 'The todo data should be equal')

    await dbClient.close()
  })

  it('Should create a todo with optional values', async () => {
    const dbClient = require('../../lib/db')(logger)
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

    assert.deepEqual(response.body.data, {
      done: true,
      id: 1,
      priority: 3,
      title: 'Learn Javascript',
    }, 'Response body should be equal to todo data')
    assert.deepEqual(response.status, 201, 'Status code should be 201')

    const todos = await dbClient.query('SELECT done, id, todo_priority AS priority, title FROM todos').then(res => res.rows)

    assert.deepEqual(todos.length, 1, 'The number of todos in DB should be 1')
    assert.deepEqual(todos[0], {
      done: true,
      id: 1,
      priority: 3,
      title: 'Learn Javascript',
    }, 'The todo data should be equal')

    await dbClient.close()
  })

  it('Should return an error invalid payload', async () => {
    const dbClient = require('../../lib/db')(logger)
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
    await dbClient.close()

    assert.deepEqual(response.body, {
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
    assert.deepEqual(response.status, 400, 'Status code should be 400')

  })

  it('Should return an error of database failure', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    const server = app({
      dbClient: {
        query: async () => {
          throw new Error('Database is down')
        },
      }, logger
    }).listen(config.app.port)

    const response = await request
      .post('http://localhost/todos')
      .send({ title: 'Lean Javascript' })
      .catch(err => err.response)

    server.close()
    await dbClient.close()

    assert.deepEqual(response.body, {
      error: 'CREATE_TODO_ERROR',
      info: {
        done: false,
        priority: 0,
        title: 'Lean Javascript',
      },
      message: 'Something went wrong while inserting new todo: Database is down',
    }, 'Response body should be an error with error messages concatenated by verror module')
    assert.deepEqual(response.status, 500, 'Status code should be 500')
  })

})
