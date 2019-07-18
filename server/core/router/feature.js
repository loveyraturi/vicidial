'use strict'
const router = require('express').Router()
const feature = require('../controllers/feature')

module.exports = (function () {
  router.get('/getTransactionFields/:pojo', feature.getTransactionFields)
  return router
}())

module.exports = (function () {
  router.post('/marchantdata', feature.marchantData)
  router.get('/getDuration', feature.getDuration)
  router.get('/getCountry', feature.getCountryList)
  router.get('/getMcc', feature.getMccList)
  router.get('/getmerchantdata', feature.getMerchantData)
  router.get('/findfeaturetype/:featuretypeid', feature.findFeatureTypeDetailsController)
  router.get('/findfeaturetype', feature.findFeatureTypeController)
  router.get('/feature/:featuretypeid', feature.getFeatureDetailsController)
  router.get('/findfeaturelist', feature.findFeatureListController)
  router.get('/findactivefeaturelist', feature.findActiveFeatureListController)
  router.get('/getFeatureDetails/:featuretypeid', feature.getFeatureDetailsForRuleController)
  router.put('/updatefeature/:featureid', feature.updateFeatureController)
  router.post('/createfeature', feature.createFeature)
  return router
}())
