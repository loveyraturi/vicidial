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
        }
        var responseBackend = {
          name: response[0].name,
          phoneNumber: response[0].phonenumber,
          status: isValid
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
    fetchUsers: (req, res) => {
      user.fetchUsers(function (response) {
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
  }
})()
module.exports = accumulatorController