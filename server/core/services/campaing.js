const SQLBuilder = require('json-sql-builder');
var restClient = require('node-rest-client').Client;
const campaing = require('../model/campaing')

var isDependentGlobal = 0

module.exports.createCampaing = (data, sendResponse) => {
  return campaing.createCampaing(data,sendResponse).then(sendResponse)
}
module.exports.fetchCampaingById = (id, sendResponse) => {
  return campaing.fetchCampaingById(id).then(sendResponse)
}
module.exports.deleteCampaing = (id, sendResponse) => {
  return campaing.deleteCampaing(id,sendResponse).then(sendResponse)
}
module.exports.updateCampaing = (data, sendResponse) => {
  return campaing.updateCampaing(data,sendResponse).then(sendResponse)
}
module.exports.fetchCampaing = (sendResponse) => {
  return campaing.fetchCampaing().then(sendResponse)
}