'use strict'
const agent = require('../services/agent')

const accumulatorController = (function () {
  return {
    fetchAllAgentsCount: (req, res) => {
      console.log("fetchAllAgentsCount")
      agent.fetchAllAgentsCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchLiveAgentsCount: (req, res) => {
      console.log("fetchLiveAgentsCount")
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
    },
    fetchLiveChannelCount: (req, res) => {
      agent.fetchLiveChannelCount(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchLiveChannel: (req, res) => {
      agent.fetchLiveChannel(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },

    fetchAllAgentsCountByGroup: (req, res) => {
      console.log("fetchAllAgentsCountByGroup")
      agent.fetchAllAgentsCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchLiveAgentsCountByGroup: (req, res) => {
      console.log("fetchLiveAgentsCountByGroup")
      agent.fetchLiveAgentsCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchPausedAgentsCountByGroup: (req, res) => {
      agent.fetchPausedAgentsCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchHoldAgentsCountByGroup: (req, res) => {
      agent.fetchHoldAgentsCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchActiveUsersCountByGroup: (req, res) => {
      agent.fetchActiveUsersCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchActiveCampaingsCountByGroup: (req, res) => {
      agent.fetchActiveCampaingsCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
   fetchAllUsersCountByGroup: (req, res) => {
    agent.fetchAllUsersCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchAllCampaingsCountByGroup: (req, res) => {
      agent.fetchAllCampaingsCountByGroup(req.params.group,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    }
  }
})()
module.exports = accumulatorController