'use strict'
const user = require('../services/user')

const accumulatorController = (function () {
  return {
    createUser: (req, res) => {
      user.createUser(req.body, function (response) {
        res.status(200).json(response)
      })
    },
    deleteUser: (req, res) => {
      user.deleteUser(req.params.id, function (response) {
        res.status(200).json(response)
      });
    },
    authenticate: (req, res) => {
      user.authenticate(req.body, function (response) {
        console.log(response)
        var isValid = true
        if (response.length == 0) {
          isValid = false
          var responseBackend = {
            status: isValid
            
          }
        }else{
        var responseBackend = {
          name: response[0].user,
          phoneNumber: response[0].phone_login,
          status: isValid,
          level: response[0].user_level,
          group: response[0].user_group
        }
      }
        console.log(responseBackend)
        res.status(200).json(responseBackend)
      });
    },
    updateUser: (req, res) => {
      user.updateUser(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    updateGroup: (req, res) => {
      user.updateGroup(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchUsers: (req, res) => {
      user.fetchUsers(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchUsersByCampaing: (req, res) => {
      user.fetchUsersByCampaing(req.params.campaing,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    updateUserStatus: (req, res) => {
      user.updateUserStatus(req.body, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchUsersById: (req, res) => {
      user.fetchUsersById(req.params.id, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchUserCountByCampaing: (req, res) => {
      user.fetchUserCountByCampaing(req.params.id, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchGroupsByUser: (req, res) => {
      user.fetchGroupsByUser(req.params.id, function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchGroups: (req, res) => {
      user.fetchGroups(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchReportData: (req, res) => {
      user.fetchReportData(req.params.limit,req.params.offset,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    createExcel: (req, res) => {
      user.createExcel(req.body,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchCountOfReport: (req, res) => {
      user.fetchCountOfReport(function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchCountReportDataBetween: (req, res) => {
      user.fetchCountReportDataBetween(req.body,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchReportDataBetween: (req, res) => {
      user.fetchReportDataBetween(req.body,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchGroupsById: (req, res) => {
      user.fetchGroupsById(req.params.id,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
    fetchUserBYCampaingId: (req, res) => {
      user.fetchUserBYCampaingId(req.params.campaingId,function (response) {
        // console.log(response)
        res.status(200).json(response)
      });
    },
  }
})()
module.exports = accumulatorController