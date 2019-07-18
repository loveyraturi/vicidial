'use strict'
const accumulator = require('./accumulator')
const feature = require('./feature')

module.exports = (app) => {
  app.use('/api/accumulator', accumulator)
  app.use('/api/feature', feature)
}
