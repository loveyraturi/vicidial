'use strict'
const user = require('../controllers/user')
const router = require('express').Router()


module.exports = (function () {
  router.post('/createuser', user.createUser)
  router.post('/auth', user.authenticate)
  router.put('/updateuser', user.updateUser)
  router.get('/fetchusers', user.fetchUsers)
  router.get('/fetchusersById/:id', user.fetchUsersById)
  router.get('/deleteuser/:id', user.deleteUser)
  router.get('/fetchgroupsbyuser/:id', user.fetchGroupsByUser)
  router.get('/fetchgroups', user.fetchGroups)
  return router
}())