'use strict'
const agent = require('../services/agent')

const accumulatorController = (function () {
  return {
    fetchAllAgentsCount: (req, res) => {
      agent.fetchAllAgentsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchLiveAgentsCount: (req, res) => {
      agent.fetchLiveAgentsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchPausedAgentsCount: (req, res) => {
      agent.fetchPausedAgentsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchHoldAgentsCount: (req, res) => {
      agent.fetchHoldAgentsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchActiveUsersCount: (req, res) => {
      agent.fetchActiveUsersCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchActiveCampaingsCount: (req, res) => {
      agent.fetchActiveCampaingsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
   fetchAllUsersCount: (req, res) => {
    agent.fetchAllUsersCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchAllCampaingsCount: (req, res) => {
      agent.fetchAllCampaingsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    }
  }
})()
module.exports = accumulatorController