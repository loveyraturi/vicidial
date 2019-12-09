const SQLBuilder = require('json-sql-builder');
var restClient = require('node-rest-client').Client;
const user = require('../model/user')

var isDependentGlobal = 0

module.exports.createUser = (data, sendResponse) => {
  return user.createUser(data,sendResponse).then(sendResponse)
}
module.exports.deleteUser = (id, sendResponse) => {
  return user.deleteUser(id,sendResponse).then(sendResponse)
}
module.exports.updateUser = (data, sendResponse) => {
  return user.updateUser(data,sendResponse).then(sendResponse)
}
module.exports.fetchUsers = (sendResponse) => {
  return user.fetchUsers().then(sendResponse)
}
module.exports.fetchGroups = (sendResponse) => {
  return user.fetchGroups().then(sendResponse)
}
module.exports.fetchGroupsByUser = (id,sendResponse) => {
  return user.fetchGroupsByUser(id).then(sendResponse)
}
