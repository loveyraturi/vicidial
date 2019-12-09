'use strict'
const campaing = require('../services/campaing')

const accumulatorController = (function () {
  return {
    createCampaing: (req, res) => {
      campaing.createCampaing(req.body, function (response) {
        res.status(200).json(response)
      })
    },
    deleteCampaing: (req, res) => {
      campaing.deleteCampaing(req.params.value, function (response) {
        res.status(200).json(response)
      });
    },
    updateCampaing: (req, res) => {
      campaing.updateCampaing(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchCampaing: (req, res) => {
      campaing.fetchCampaing(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
  }
})()
module.exports = accumulatorController
