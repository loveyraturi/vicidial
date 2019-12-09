'use strict'
const user = require('./user')
const campaing = require('./campaing')

module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/campaing', campaing)
}
