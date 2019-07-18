const mongoos = require('mongoose');


var rulecategory = new mongoos.Schema({
    category: {type: String, default: ''},
    status: { type: String, default: 'A' },
    date: { type: Date, default: Date.now }
});

var rulecategory = mongoos.model('rulecategory',rulecategory);

module.exports = rulecategory;