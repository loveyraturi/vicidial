const mongoos = require('mongoose');


var fraudstatus = new mongoos.Schema({
    status: { type: String, default: '' },
    date: { type: Date, default: Date.now }
});

var fraudstatus = mongoos.model('fraudstatus',fraudstatus);

module.exports = fraudstatus;