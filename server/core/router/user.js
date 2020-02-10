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
  router.get('/fetchusersbycampaing/:campaing',user.fetchUsersByCampaing)
  router.get('/fetchusersById/:id', user.fetchUsersById)
  router.get('/fetchusercountbycampaing/:id', user.fetchUserCountByCampaing)
  router.get('/deleteuser/:id', user.deleteUser)
  router.get('/fetchgroupsbyuser/:id', user.fetchGroupsByUser)
  router.get('/fetchgroups', user.fetchGroups)
  router.get('/fetchgroupsbyid/:id', user.fetchGroupsById)
  router.get('/fetchreportdata/:limit/:offset', user.fetchReportData)
  router.get('/fetchcountofreport', user.fetchCountOfReport)
  router.post('/fetchcountreportdatabetween', user.fetchCountReportDataBetween)
  router.post('/fetchreportdatabetween', user.fetchReportDataBetween)
  router.post('/createexcel', user.createExcel)
  router.get('/fetchuserfromcampaing/:campaingId', user.fetchUserBYCampaingId)
  return router
}())