var { schemaValidator, userSchema } = require('../config/schema')
var bcrypt = require('bcryptjs');

module.exports.createSystemUser = function (userData, response) {
  var result = schemaValidator.validate(userData, userSchema)
  if (result.valid) {
    var salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    userData.salt = salt

    global.db('systemuser')
      .insert(userData)
      .returning('name')
      .then(function (output) {
        response({
          'message': 'User created successfully'
        }, 200)
      })
      .catch(function (error) {
        response({
          'message': 'Unable to create the user',
          'error': error
        }, 400)
      });
  }
  else {
    response({
      'message': 'Unable to create the user',
      'error': result.errors
    }, 400)
  }

}

module.exports.findSystemUserByName = function (username) {
  return global.db
    .select('*')
    .from('systemuser')
    .where('username', username)
}