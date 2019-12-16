'use strict'
const agent = require('../controllers/agent')
const router = require('express').Router()


module.exports = (function () {
  router.get('/fetchallagentscount', agent.fetchAllAgentsCount)
  router.get('/fetchliveagentscount', agent.fetchLiveAgentsCount)
  router.get('/fetchpausedagentscount', agent.fetchPausedAgentsCount)
  router.get('/fetchholdagentscount', agent.fetchHoldAgentsCount)
  router.get('/fetchactiveuserscount', agent.fetchActiveUsersCount)
  router.get('/fetchactivecampaingscount', agent.fetchActiveCampaingsCount)
  router.get('/fetchalluserscount', agent.fetchAllUsersCount)
  router.get('/fetchallcampaingscount', agent.fetchAllCampaingsCount)
 
  return router
}())