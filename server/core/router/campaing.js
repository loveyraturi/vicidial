'use strict'
const campaing = require('../controllers/campaing')
const router = require('express').Router()


module.exports = (function () {
  router.post('/createcampaing', campaing.createCampaing) // Done
  router.post('/updatecampaing', campaing.updateCampaing) // Done
  router.get('/fetchcampaing', campaing.fetchCampaing) // Done
  router.put('/updatecampaingstatus', campaing.updateCampaingStatus)
  router.get('/fetchCampaingById/:id', campaing.fetchCampaingById)
  router.get('/deletecampaing/:id', campaing.deleteCampaing) // Done
  return router
}())