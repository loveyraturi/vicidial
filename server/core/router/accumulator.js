'use strict'
const accumulator = require('../controllers/accumulator')
const router = require('express').Router()


module.exports = (function () {
  router.post('/create', accumulator.createAccumulator) // Done
  router.post('/update', accumulator.updateAccumulator) // Done
  router.post('/updateStatus', accumulator.updateAccumulatorStatus) // Done
  router.post('/updateAccumulatorValidity',accumulator.updateAccumulatorValidity) // Done
  router.post('/createAccuireAccumulator', accumulator.createAccuireAccumulator) // Done
  router.post('/functional-non-functional-live', accumulator.functionalNonFunctionalLive)
  router.get('/fetchAccumulators', accumulator.getAccumulatorList) // Done
  router.get('/fetchInactiveAccumulators', accumulator.getInactiveAccumulatorList) // Done
  router.get('/fetchCountOfAllAccumulators/:value', accumulator.getCountOfAllAccumulator) // Done
  router.get('/fetchCountOfActiveAccumulators/:value', accumulator.getCountOfActiveAccumulator) // Done
  router.get('/fetchCountOfInactiveAccumulators/:value', accumulator.getCountOfInactiveAccumulator) // Done
  router.get('/fetchAccumulatorByValue/:value', accumulator.getAccumulatorByValue) // Done
  router.get('/fetchAccumulatorListByType/:accumulator_for', accumulator.getAccumulatorListByType) //Done
  router.get('/fetchAccumulatorListByTypev1/:accumulator_for', accumulator.getAccumulatorListByTypev1) //Done
  router.get('/fetchInactiveAccumulatorListByType/:accumulator_for', accumulator.getInactiveAccumulatorListByType)//Done
  router.get('/getAccumulator/:status', accumulator.getAccumulator)
  router.post('/functional-non-functional-update', accumulator.updateFunctionalNonFunctionalAccumulator) // Done
  return router
}())