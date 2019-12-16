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
module.exports.fetchAllUsersCount = (sendResponse) => {
    return agent.fetchAllUsersCount().then(sendResponse)
  }
module.exports.fetchAllCampaingsCount = (sendResponse) => {
    return agent.fetchAllCampaingsCount().then(sendResponse)
  }
