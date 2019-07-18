const mongoos = require('mongoose');


var incommingMessage = new mongoos.Schema({
    incommingMessage: {type: JSON, default: {}},
    date: { type: Date, default: Date.now }
});

incommingMessage = mongoos.model('incommingMessage',incommingMessage);

module.exports = incommingMessage;