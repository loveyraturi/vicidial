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
  app.use(session({
    secret: process.env.SESSION_SECRET
  }));
  // app.use(bodyParser.urlencoded({
  //   extended: true
  // }))
  // app.use(bodyParser.json())
  app.use(fileUpload({
    limits: {
        fileSize: 10000000000 //1mb
    },
    abortOnLimit: true
 }));
  app.use(cors({
    credentials: true,
    origin: true
  }))
  app.use(express.json({
    limit: '50mb'
  }));
  app.use(express.urlencoded({
    limit: '50mb'
  }));
  app.use(bodyParser.json({
    limit: '50mb'
  }));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
  //app.set('views', path.join(__dirname, '../../../dist'))
  //app.use('/', express.static(path.join(__dirname, '../../../dist')))
}