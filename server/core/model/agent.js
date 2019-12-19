module.exports.fetchAllAgentsCount = (sendResponse) => {
  return global.db
    .count('*',{as: 'count'})
    .from('vicidial_live_agents')
}
module.exports.fetchLiveAgentsCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_live_agents').where({status:'READY'})
}
module.exports.fetchPausedAgentsCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_live_agents').where({status:'PAUSED'})
}
module.exports.fetchHoldAgentsCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_live_agents').where({status:'QUEUE'})
}
module.exports.fetchActiveUsersCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
    .from('vicidial_users').where({active: 'Y'})
}
module.exports.fetchActiveCampaingsCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
    .from('vicidial_campaigns').where({active: 'Y'})
}
module.exports.fetchAllUsersCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_users')
}
module.exports.fetchAllCampaingsCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_campaigns')
}
