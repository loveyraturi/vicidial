'use strict'
const campaing = require('../controllers/campaing')
const router = require('express').Router()
var pathmodule = require("path");
var multer  = require('multer')
const testFolder = process.env.DESTINATION_FILE_PATH;
const fs = require('fs');
const chokidar = require('chokidar');

const watcher = chokidar.watch(process.env.SOURCE_FILE_PATH, { persistent: true });
 
watcher
  .on('add', path => {console.log(`File ${pathmodule.basename(path)} has been added`)
  require('sync-directory')(process.env.SOURCE_FILE_PATH, process.env.DESTINATION_FILE_PATH, {
    type: 'copy'
  });
})
  .on('change', path => {console.log(`File ${pathmodule.basename(path)} has been changed`)
  require('sync-directory')(process.env.SOURCE_FILE_PATH, process.env.DESTINATION_FILE_PATH, {
    type: 'copy'
  });
})
  .on('unlink', path => {console.log(`File ${pathmodule.basename(path)} has been removed`)
  require('sync-directory')(process.env.SOURCE_FILE_PATH, process.env.DESTINATION_FILE_PATH, {
    type: 'copy'
  });
});

try {
  
} catch (err) {
  console.error(err)
}
 

module.exports = (function () {
  router.post('/createcampaing', campaing.createCampaing) // Done
  router.get('/fetchallfiles', (req,res)=>{
    var outputFile=[]
    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        outputFile.push(file)
      });
      res.send(outputFile)
  });
})
  router.put('/updatecampaing', campaing.updateCampaing) // Done
  router.put('/updatesurvey', campaing.updateSurvey) // Done
  router.get('/fetchcampaing', campaing.fetchCampaing) // Done
  router.put('/updatecampaingstatus', campaing.updateCampaingStatus)
  router.get('/fetchCampaingById/:id', campaing.fetchCampaingById)
  router.get('/deletecampaing/:id', campaing.deleteCampaing) // Done
  return router
}())