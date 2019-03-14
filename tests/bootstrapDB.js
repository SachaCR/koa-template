
const fs = require('fs')
const path = require('path')

const logger = require('./mocks/logger')
const dbClient = require('../lib/db')(logger)

async function bootstrapDB() {
  const sqlScript = fs.readFileSync(path.resolve(__dirname, '../config/bootstrapDB.sql')).toString()
  await dbClient.query(sqlScript)
}

module.exports = bootstrapDB
