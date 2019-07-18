const mongoos = require('mongoose');


var fraudsummery = new mongoos.Schema({
    card: { type: String, default: '' },
    triggeredrule: {type: JSON, default: {}},
    response:{type: JSON, default: {}},
    activerule: {type: JSON, default: {}},
    readStatus: {type: Boolean, default: false},
    date: { type: Date, default: Date.now }
});


var fraudsummery = mongoos.model('fraudsummery',fraudsummery);

module.exports = fraudsummery;