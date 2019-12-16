module.exports.fetchAllAgentsCount = (sendResponse) => {
  return global.db
    .count('*')
    .from('vicidial_live_agents')
}
module.exports.fetchLiveAgentsCount = (sendResponse) => {
  return global.db
  .count('*')
  .from('vicidial_live_agents')
}
module.exports.fetchPausedAgentsCount = (sendResponse) => {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
module.exports.fetchHoldAgentsCount = (sendResponse) => {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
module.exports.fetchActiveUsersCount = (sendResponse) => {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
module.exports.fetchActiveCampaingsCount = (sendResponse) => {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
module.exports.fetchAllUsersCount = (sendResponse) => {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
module.exports.fetchAllCampaingsCount = (sendResponse) => {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
