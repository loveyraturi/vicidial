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
module.exports.fetchLiveChannel = (sendResponse) => {
  return global.db
  .select('*')
  .from('live_channels')
}
module.exports.fetchActiveUsersCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
    .from('vicidial_users').where({active: 'Y'})
}
module.exports.fetchLiveChannelCount = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
    .from('live_channels')
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



module.exports.fetchAllAgentsCountByGroup = (group) => {
  return global.db
    .count('*',{as: 'count'})
    .from('vicidial_live_agents')
}
module.exports.fetchLiveAgentsCountByGroup = (group) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_live_agents').where({status:'READY'})
}
module.exports.fetchPausedAgentsCountByGroup = (group) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_live_agents').where({status:'PAUSED'})
}
module.exports.fetchHoldAgentsCountByGroup = (group) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_live_agents').where({status:'QUEUE'})
}
module.exports.fetchActiveUsersCountByGroup = (group) => {
  return global.db
  .count('*',{as: 'count'})
    .from('vicidial_users').where({active: 'Y'})
}
module.exports.fetchActiveCampaingsCountByGroup = (group) => {
  return global.db
  .count('*',{as: 'count'})
    .from('vicidial_campaigns').where({active: 'Y'})
}
module.exports.fetchAllUsersCountByGroup = (group) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_users')
}
module.exports.fetchAllCampaingsCountByGroup = (sendResponse) => {
  return global.db
  .count('*',{as: 'count'})
  .from('vicidial_campaigns')
}
