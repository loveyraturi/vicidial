const express = require('express');
const app = express();
require('./core/config/express')(app);

require('./core/router')(app);

module.exports = app;
