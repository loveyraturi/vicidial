const mongoos = require('mongoose');


var ruleresources = new mongoos.Schema({
    resurcename: {type: String, default: ''},
    resurcesignature: {type: String, default: ''},
    date: { type: Date, default: Date.now }
});

var rulecategory = mongoos.model('rulecategory',rulecategory);

module.exports = rulecategory;