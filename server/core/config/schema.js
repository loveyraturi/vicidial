var Validator = require('jsonschema').Validator;
var v = new Validator();

var userSchema = {
  "id": "userSchema",
  "type": "object",
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" },
    "salt": {"type": "string"}
  },
  "required": ["username", "password"],
  "throwError": true
};
v.addSchema(userSchema, 'userSchema');

module.exports.userSchema = userSchema
module.exports.schemaValidator = v