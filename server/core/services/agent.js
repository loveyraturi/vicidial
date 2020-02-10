const SQLBuilder = require('json-sql-builder');
var restClient = require('node-rest-client').Client;
const agent = require('../model/agent')

var isDependentGlobal = 0


module.exports.fetchAllAgentsCount = (sendResponse) => {
    return agent.fetchAllAgentsCount().then(sendResponse)
  }
module.exports.fetchLiveAgentsCount = (sendResponse) => {
    return agent.fetchLiveAgentsCount().then(sendResponse)
  }
module.exports.fetchPausedAgentsCount = (sendResponse) => {
    return agent.fetchPausedAgentsCount().then(sendResponse)
  }
module.exports.fetchHoldAgentsCount = (sendResponse) => {
    return agent.fetchHoldAgentsCount().then(sendResponse)
  }
module.exports.fetchActiveUsersCount = (sendResponse) => {
    return agent.fetchActiveUsersCount().then(sendResponse)
  }
module.exports.fetchActiveCampaingsCount = (sendResponse) => {
    return agent.fetchActiveCampaingsCount().then(sendResponse)
  }
  module.exports.fetchLiveChannelCount = (sendResponse) => {
    return agent.fetchLiveChannelCount().then(sendResponse)
  }
  module.exports.fetchLiveChannel = (sendResponse) => {
    return agent.fetchLiveChannel().then(sendResponse)
  }
module.exports.fetchAllUsersCount = (sendResponse) => {
    return agent.fetchAllUsersCount().then(sendResponse)
  }
module.exports.fetchAllCampaingsCount = (sendResponse) => {
    return agent.fetchAllCampaingsCount().then(sendResponse)
  }



  module.exports.fetchAllAgentsCountByGroup = (group,sendResponse) => {
    return agent.fetchAllAgentsCountByGroup(group).then(sendResponse)
  }
module.exports.fetchLiveAgentsCountByGroup = (group,sendResponse) => {
    return agent.fetchLiveAgentsCountByGroup(group).then(sendResponse)
  }
module.exports.fetchPausedAgentsCountByGroup = (group,sendResponse) => {
    return agent.fetchPausedAgentsCountByGroup(group).then(sendResponse)
  }
module.exports.fetchHoldAgentsCountByGroup = (group,sendResponse) => {
    return agent.fetchHoldAgentsCountByGroup(group).then(sendResponse)
  }
module.exports.fetchActiveUsersCountByGroup = (group,sendResponse) => {
    return agent.fetchActiveUsersCountByGroup(group).then(sendResponse)
  }
module.exports.fetchActiveCampaingsCountByGroup = (group,sendResponse) => {
    return agent.fetchActiveCampaingsCountByGroup(group).then(sendResponse)
  }
module.exports.fetchAllUsersCountByGroup = (group,sendResponse) => {
    return agent.fetchAllUsersCountByGroup(group).then(sendResponse)
  }
module.exports.fetchAllCampaingsCountByGroup = (group,sendResponse) => {
    return agent.fetchAllCampaingsCountByGroup(group).then(sendResponse)
  }
