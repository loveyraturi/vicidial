'use strict'
const accumulatorProcess = require('../services/accumulatorProcess')

const accumulatorController = (function () {
  return {
    createAccumulator: (req, res) => {
      accumulatorProcess.createAccumulator(req.body, function (response) {
        res.status(200).json(response)
      })
    },
    createAccuireAccumulator: (req, res) => {
      accumulatorProcess.createAccuireAccumulator(req.body, function (response) {
        res.status(200).json(response)
      })
    },
    functionalNonFunctionalLive: (req, res) => {
      accumulatorProcess.functionalNonFunctionalLive(req.body, function (response) {
        res.status(200).json(response)
      })
    },
    getAccumulatorList: (req, res) => {
      accumulatorProcess.fetchAccumulators(function (response) {
        res.status(200).json(response)
      });
    },
    getAccumulatorListByType: (req, res) => {
      // console.log("accumulator for",req.params.accumulator_for)
      accumulatorProcess.fetchAccumulatorsByType(req.params.accumulator_for, function (response) {
        res.status(200).json(response)
      });
    },
    getAccumulatorListByTypev1: (req, res) => {
      // console.log("accumulator for",req.params.accumulator_for)
      accumulatorProcess.fetchAccumulatorsByTypev1(req.params.accumulator_for, function (response) {
        res.status(200).json(response)
      });
    },
    getInactiveAccumulatorListByType: (req, res) => {
      // console.log("in active accumulator for",req.params.accumulator_for)
      accumulatorProcess.fetchInactiveAccumulatorsByType(req.params.accumulator_for, function (response) {
        res.status(200).json(response)
      });
    },

    getInactiveAccumulatorList: (req, res) => {
      accumulatorProcess.fetchInactiveAccumulators(function (response) {
        res.status(200).json(response)
      });
    },
    getCountOfAllAccumulator: (req, res) => {
      accumulatorProcess.fetchCountOfAllAccumulators(req.params.value, function (response) {
        res.status(200).json(response)
      });
    },
    getCountOfActiveAccumulator: (req, res) => {
      accumulatorProcess.fetchCountOfActiveAccumulators(req.params.value, function (response) {
        res.status(200).json(response)
      });
    },
    getCountOfInactiveAccumulator: (req, res) => {
      accumulatorProcess.fetchCountOfInactiveAccumulators(req.params.value, function (response) {
        res.status(200).json(response)
      });
    },
    getAccumulatorByValue: (req, res) => {
      accumulatorProcess.fetchAccumulatorsByValue(req.params.value, function (response) {
        res.status(200).json(response)
      });
    },
    updateAccumulator: (req, res) => {
      accumulatorProcess.updateAccumulator(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    updateAccumulatorStatus: (req, res) => {
      accumulatorProcess.updateAccumulatorStatus(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    updateAccumulatorValidity: (req, res) => {
      accumulatorProcess.updateAccumulatorValidity(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },

    getAccumulator: (req, res) => {
      const status = req.params['status']
      accumulatorProcess.getAccumulator(status, function (response) {
        res.status(200).json(response)
      })
    },
    updateFunctionalNonFunctionalAccumulator: (req, res) => {
      accumulatorProcess.updateFunctionalNonFunctionalAccumulator(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },

  }
})()
module.exports = accumulatorController
