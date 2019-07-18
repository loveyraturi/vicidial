const mongoos = require('mongoose');


var singlerule = new mongoos.Schema({
    rulename: { type: String, default: '' },
    condition: { type: String, default: '' },
    action: { type: String, default: '' },
    status: { type: String, default: 'A' },
    date: { type: Date, default: Date.now }
});

var singlerule = mongoos.model('singlerull',singlerule);

module.exports = singlerule;