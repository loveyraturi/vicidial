const SQLBuilder = require('json-sql-builder');
var restClient = require('node-rest-client').Client;
const user = require('../model/user')

var isDependentGlobal = 0

module.exports.createUser = (data, sendResponse) => {
  console.log(data)
  return user.createUser(data,sendResponse).then(sendResponse)
}
module.exports.authenticate = (data,sendResponse) => {
  return user.authenticate(data).then(sendResponse)
}
module.exports.deleteUser = (id, sendResponse) => {
  return user.deleteUser(id,sendResponse).then(sendResponse)
}
module.exports.updateUser = (data, sendResponse) => {
  return user.updateUser(data,sendResponse).then(sendResponse)
}
module.exports.updateGroup = (data, sendResponse) => {
  return user.updateGroup(data,sendResponse).then(sendResponse)
}
module.exports.updateUserStatus = (data, sendResponse) => {
  return user.updateUserStatus(data,sendResponse).then(sendResponse)
}
module.exports.fetchUsers = (sendResponse) => {
  return user.fetchUsers().then(sendResponse)
}
module.exports.fetchUsersByCampaing = (campaing,sendResponse) => {
  return user.fetchUsersByCampaing(campaing).then(sendResponse)
}
module.exports.fetchGroups = (sendResponse) => {
  return user.fetchGroups().then(sendResponse)
}
module.exports.fetchReportData = (limit,offset,sendResponse) => {
  return user.fetchReportData(limit,offset).then(sendResponse)
}
module.exports.createExcel = (data,sendResponse) => {
  return user.createExcel(data,sendResponse)
}
module.exports.fetchCountOfReport = (sendResponse) => {
  return user.fetchCountOfReport().then(sendResponse)
}
module.exports.fetchCountReportDataBetween = (data,sendResponse) => {
  return user.fetchCountReportDataBetween(data).then(sendResponse)
}
module.exports.fetchReportDataBetween = (data,sendResponse) => {
  return user.fetchReportDataBetween(data).then(sendResponse)
}
module.exports.fetchGroupsById = (id,sendResponse) => {
  return user.fetchGroupsById(id).then(sendResponse)
}
module.exports.fetchUserBYCampaingId = (id,sendResponse) => {
  return user.fetchUserBYCampaingId(id).then(sendResponse)
}
module.exports.fetchUsersById = (id,sendResponse) => {
  return user.fetchUsersById(id).then(sendResponse)
}
module.exports.fetchUserCountByCampaing = (id,sendResponse) => {
  return user.fetchUserCountByCampaing(id).then(sendResponse)
}
module.exports.fetchGroupsByUser = (id,sendResponse) => {
  return user.fetchGroupsByUser(id).then(sendResponse)
}
