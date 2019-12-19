'use strict'
const user = require('./user')
const campaing = require('./campaing')
const agent = require('./agent')

module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/campaing', campaing)
  app.use('/api/agents', agent)
}
