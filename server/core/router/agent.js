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
  router.get('/fetchlivechannelcount', agent.fetchLiveChannelCount)
  router.get('/fetchlivechannel', agent.fetchLiveChannel)

  router.get('/fetchallagentscountbygroup/:group', agent.fetchAllAgentsCountByGroup)
  router.get('/fetchliveagentscountbygroup/:group', agent.fetchLiveAgentsCountByGroup)
  router.get('/fetchpausedagentscountbygroup/:group', agent.fetchPausedAgentsCountByGroup)
  router.get('/fetchholdagentscountbygroup/:group', agent.fetchHoldAgentsCountByGroup)
  router.get('/fetchactiveuserscountbygroup/:group', agent.fetchActiveUsersCountByGroup)
  router.get('/fetchactivecampaingscountbygroup/:group', agent.fetchActiveCampaingsCountByGroup)
  router.get('/fetchalluserscountbygroup/:group', agent.fetchAllUsersCountByGroup)
  router.get('/fetchallcampaingscountbygroup/:group', agent.fetchAllCampaingsCountByGroup)
 
  return router
}())