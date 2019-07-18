'use strict'
const bodyParser = require('body-parser')
var cors = require('cors');
const express = require('express')
const path = require('path')
const session = require('express-session');
var dbConnection = require('./dbSettings').dbConnection
const fileUpload = require('express-fileupload');


global.db = dbConnection


module.exports = function (app) {
  
  //app.engine('html', require('ejs').renderFile)
  //app.set('view engine', 'html')
  app.use(session({secret: process.env.SESSION_SECRET}));
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(fileUpload());
  app.use(cors())
  //app.set('views', path.join(__dirname, '../../../dist'))
  //app.use('/', express.static(path.join(__dirname, '../../../dist')))
}
