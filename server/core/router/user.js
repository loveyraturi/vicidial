'use strict'
const user = require('../controllers/user')
const router = require('express').Router()


module.exports = (function () {
  router.post('/createuser', user.createUser)
  router.post('/auth', user.authenticate)
  router.put('/updateuser', user.updateUser)
  router.put('/updategroup', user.updateGroup)
  router.put('/updateuserstatus', user.updateUserStatus)
  router.get('/fetchusers', user.fetchUsers)
  router.get('/fetchusersById/:id', user.fetchUsersById)
  router.get('/deleteuser/:id', user.deleteUser)
  router.get('/fetchgroupsbyuser/:id', user.fetchGroupsByUser)
  router.get('/fetchgroups', user.fetchGroups)
  router.get('/fetchgroupsbyid/:id', user.fetchGroupsById)
  router.get('/fetchreportdata', user.fetchReportData)
  router.get('/fetchreportdatabetween/:datefrom/:dateto', user.fetchReportDataBetween)
  router.get('/fetchuserfromcampaing/:campaingId', user.fetchUserBYCampaingId)
  return router
}())