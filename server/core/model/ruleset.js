const accumulatorProcess = require('../services/accumulatorProcess')
const createRawQuery = require('../config/sqlGrammer').createRawQuery
module.exports.getTransactionField = (pojo) => {

  return global.db.select('*')
    .from('drl_pojofield as field')
    .leftJoin('drl_pojo as pojo', 'pojo.id', 'field.pojoid')
    .leftJoin('drl_pojofield_def', 'drl_pojofield_def.pojofieldid', 'field.id')
    .where({ name: pojo })
    .where({ active: 1 })
    .orderBy('orderindex', 'desc')
}

module.exports.getTransactionFieldDetails = (fieldId) => {
  return global.db.select('field', 'locale', 'type as dataType', 'featurerefid', 'active as active').from('drl_pojofield')
    .where({ id: fieldId })
}

module.exports.getTransactionFieldDetailsByField = (field) => {
  return global.db.select('id', 'locale', 'type as dataType').from('drl_pojofield')
    .where({ 
      field: field,
      active: 1 
    })
}

module.exports.updateTransactionFieldDetails = (where, status) => {
  global.db.table('drl_pojofield')
    .where(where)
    .update({
      active: status
    })
    .returning('*')
    .bind(console)
    .then((res) => {
    })
    .catch(console.error);
}

module.exports.getTransactionAllFieldDetails = (fieldKey) => {
  
  return global.db.select('*').from('drl_pojofield')
    .where({ dbfield: fieldKey })
}

module.exports.getObjectsByvalue = async function (value, response) {
  global.db.select('field', 'locale').from('drl_pojofield')
    .where({ pojoid: value })
    .then(response)
}

module.exports.getObjectsByvaluePromis = async function (value, type, response) {

  global.db.select('field', 'locale', 'dbfield', 'type', 'isdependent').from('drl_pojofield')
    .where({ pojoid: value })
    .where({ dbfield: type })
    .then(response)

}
module.exports.getCardObjectsByvalue = async function (value, response) {
  global.db.select(['value,locale']).from('cardsetting')
    .then(response)
}

module.exports.getMerchantObjectsByvalue = async function (value, response) {
  global.db.select(['value,locale']).from('merchantsetting')
    .then(response)
}

module.exports.insertRule = function (rule, response, data) {

  global.db('rules')
    .insert(rule)
    .returning('*')
    .bind(console)
    .then((res) => {
      data.ref_id = res
      global.db('heuristic_field')
        .insert(data)
        .returning('*')
        .bind(console)
        .then((res) => {
          let fieldId = res[0]
          let data1 = {
            "fieldid": fieldId,
            "defination": '{"compare":{"compareType":"Equal|Not Equal","type":"dropdownsingle"}}'
          }

          global.db('heuristic_field_def')
            .insert(data1)
            .returning('*')
            .bind(console)
            .then((res) => {
              //let fieldId = res[0]

            })
            .catch(function (err) { console.log(err) });
        })
        .catch(console.error);

      response({ status: true })
    })
    .catch(console.error);
}

module.exports.insertCustomeRule = function (rule, response) {
  global.db('customerules')
    .insert(rule)
    .returning('*')
    .bind(console)
    .then(() => {
      response({ status: true })
    })
    .catch(console.error);
}
module.exports.getCountOfActiveRules = function (rule_for) {

  return global.db('rules').count(
    {
      countRules: ['name']
    }
  )
    .from('rules').as('rules')
    .where({ status: 1, rule_for: rule_for })




  // return global.db.select(['count(name) countRules']).from('rules rules').where({ status: 1, rule_for: rule_for })
}
module.exports.getCountOfAllRules = function (rule_for) {

  return global.db('rules').count(
    {
      countRules: ['name']
    }
  )
    .from('rules').as('rules')
    .where({ rule_for: rule_for })
}

module.exports.getCountOfInactiveRules = function (rule_for) {
  return global.db('rules').count(
    {
      countRules: ['name']
    }
  )
    .from('rules').as('rules')
    .where({ status: 0, rule_for: rule_for })
}
module.exports.updateRule = function (rule, response) {

  global.db('rules')
    .where('name', '=', rule.name)
    .update(rule)
    .then((res, err) => {
      if (err) return console.error("error: " + err.msg);
      response({ status: true })
    })
}
module.exports.updateCustomRule = function (rule, id, response) {

  global.db('customerules')
    .where('id', '=', id)
    .update(rule)
    .then((res, err) => {
      if (err) return console.error("error: " + err.msg);
      response({ status: true })
    })


  /*global.db.update('customerules', rule, { id: id }, (err, res) => {
    if (err) return console.error("error: " + err.msg);
    response({ status: true })
  });*/
}

module.exports.getRules = function (value) {

  return global.db.select(
    'id',
    'name',
    'rule',
    'description',
    'structure',
    'rule_type',
    'response',
    'status',
    'rule_for',
    'date_from',
    'date_to',
    'lastmodifieddate',
    'lastactivationdate',
    'isvalid',
    'statussandbox'
  )
    .from('rules').as('rules')
    .where({ status: 1, rule_for: value })
    .orderBy('id', 'desc')



}
module.exports.fetchCustomRules = function (value) {

  return global.db.select('id', 'name', 'query', 'description', 'customeoperations', 'response', 'status', 'rule_for', 'isvalid')
    .from('customerules').as('customerules')
    .where({ status: 1, rule_for: value })
    .orderBy('id', 'desc')
}

module.exports.getInactiveRules = function (value) {
  return global.db.select('id', 'name', 'rule', 'description', 'structure', 'rule_type', 'response', 'status', 'rule_for', 'date_from', 'date_to', 'lastmodifieddate', 'lastactivationdate', 'isvalid')
    .from('rules').as('rules')
    .where({ status: 0, rule_for: value })
    .orderBy('id', 'desc')
}

module.exports.getCustomInactiveRules = function (value) {

  return global.db.select('id', 'name', 'query', 'description', 'customeoperations', 'response', 'status', 'rule_for', 'isvalid')
    .from('customerules')
    .where({ status: 0, rule_for: value })
    .orderBy('id', 'desc')

}
module.exports.getRuleByValue = function (value) {

  return global.db.select('id', 'name', 'rule', 'description', 'structure', 'rule_type', 'response', 'status', 'rule_for', 'date_from', 'date_to', 'lastmodifieddate', 'lastactivationdate')
    .from('rules').as('rules')
    .where({ id: value })

}
module.exports.fetchCustomRuleByValue = function (value) {
  return global.db.select('id', 'name', 'query', 'description', 'customeoperations', 'response', 'status', 'rule_for')
    .from('customerules')
    .where({ id: value })
}

module.exports.fetchRuleByType = async function (value) {
  return global.db.select('rule_type', global.db.raw(createRawQuery('group_concat', Array('rule')) + " as rule"))
    .from('rules')
    .where({ rule_type: value })
    .where({ status: 1 })
    .groupBy('rule_type')
}

module.exports.fetchCustomRuleByName = async function (name) {
  return global.db.select('id', 'name', 'query', 'description', 'customeoperations', 'response', 'status', 'rule_for')
    .from('customerules')
    .where({ name: name })
    .where({ status: 1 })
}


module.exports.fetchRulesForEngine = function () {
  return global.db.select('rule_type', global.db.raw(createRawQuery('group_concat', Array('rule')) + " as rule"))
    .from('rules')
    .where({ status: 1 })
    .groupBy('rule_type')
}

module.exports.fetchCustomRulesForEngine = function () {

  return global.db.select('name', 'query')
    .from('customerules').as('customrules')
    .where({ status: 1 })
    .orderBy('id', 'desc')
  // return global.db.select(['id ,	name,	rule,	description,	structure,	rule_type,	response,	status,	rule_for']).from('rules rules')
}

module.exports.fetchRulesForEngineByType = function (rule_for) {

  return global.db.select('rule_type', global.db.raw(createRawQuery('group_concat', Array('rule')) + " as rule"))
    .from('rules')
    .groupBy('rule_type')
    .where({ rule_for: rule_for })
    .where({ status: 1 })

  // return global.db.select(['id ,	name,	rule,	description,	structure,	rule_type,	response,	status,	rule_for']).from('rules rules')
}



module.exports.updateRuleStatus = function (data, response, ruleType = '', rule_for) {

  global.db('rules')
    .update(data)
    .where({ name: data.name })
    .returning('*')
    .then(function (res) {

      global.db('heuristic_field')
        .update({
          active: data.status
        })
        .whereIn('ref_id', function () {
          this.select('id')
            .from('rules')
            .where({ name: data.name });
        })
        .then(() => {

        })


      if (rule_for == "issuer") {
        accumulatorProcess.updateRulesOfEngine(ruleType)
      } else {
        accumulatorProcess.updateRulesOfEngineAcquirer(ruleType)
      }
      response({ status: true })
    })
    .catch(function (error) {
      console.log(error)
      response({ status: false })
    })
}
module.exports.updateCustomRuleStatus = function (data, response, rule_for) {

  global.db('customerules')
    .update(data)
    .where({ name: data.name })
    .then(function () {
      if (rule_for == "issuer") {
        accumulatorProcess.updateRulesOfEngine(ruleType)
      } else {
        accumulatorProcess.updateCustomRulesOfEngineAcquirer(data.name)
      }
      response({ status: true })
    })
    .catch(function () {
      response({ status: false })
    })

}

module.exports.updateRuleValidity = function (data, response) {
  global.db('rules')
    .update(data)
    .where({ name: data.name })
    .then(function () {
      response({ status: true })
    })
    .catch(function () {
      response({ status: false })
    })
}

module.exports.updateCustomRuleValidity = function (data, response) {
  global.db('customerules')
    .update(data)
    .where({ name: data.name })
    .then(function () {
      response({ status: true })
    })
    .catch(function () {
      response({ status: false })
    })
}

module.exports.insertIncommingMessage = function (insertIncommingMessage, response) {

  global.db('incomming_message')
    .update(insertIncommingMessage)
    .then(function () {
      response({ status: true })
    })
    .catch(function (err) {
      console.error("error: " + err.msg);
    })

}

module.exports.insertIncommingMessageBatch = function (incommingMessageArray, response) {

  global.db.batchInsert('incomming_message', incommingMessageArray, 30)
    .returning('id')
    .then(function (ids) {
      response({ status: true })
    })
    .catch(function (error) {
      console.error("error: " + error.msg);
    });

}
module.exports.engineStatus = function () {

  return global.db.select(
    'activefrom',
    'activetill',
    global.db.raw(createRawQuery('timediff', Array('activetill', 'activefrom')) + " as active_since")
  )
    .from('engine_status')
}

module.exports.onEngineStartup = function (response) {

  global.db('engine_status')
    .update({
      activefrom: global.db.raw('now()')
    })
    .then(function (res) {
      response(res)
    })
    .catch(function (err) {
      console.error("error: " + err.msg);
    })



}

module.exports.onEngineShutdown = function (response) {

  global.db('engine_status')
    .update({
      activetill: global.db.raw('now()')
    })
    .then(function (res) {
      response(res)
    })
    .catch(function (err) {
      console.error("error: " + err.msg);
    })

}
module.exports.insertIncommingMessageAcquirer = function (insertIncommingMessage, response) {

  global.db('incomming_message_acquirer')
    .insert(insertIncommingMessage)
    .returning('*')
    .bind(console)
    .then(() => {
      response({ status: true })
    })
    .catch(console.error);
}

module.exports.insertIncommingMessageAcquirerBatch = function (incommingMessageArray, response) {

  global.db.batchInsert('incomming_message_acquirer', incommingMessageArray, 30)
    .returning('id')
    .then(function (ids) {
      response({ status: true })
    })
    .catch(function (error) {
      console.error("error: " + error.msg);
    });

}

module.exports.insertResponse = function (rule, response) {
  //console.log("insert result",rule)
  var reponseResult = {
    card_no: rule.card_no,
    merchants_type: rule.merchantsType,
    date_time: rule.date_time,
    location: rule.location,
    response_for: rule.response_for,
    stan: rule.stan
  }

  global.db('response')
    .insert(reponseResult)
    .returning('*')
    .bind(console)
    .catch(console.error);


  var responseObject = rule.rulesResponse



  for (var key in responseObject) {
    var ruleresponse = {
      stan: rule.stan,
      rule_name: key,
      action: responseObject[key]
    }


    global.db('response_rules')
      .insert(ruleresponse)
      .returning('*')
      .bind(console)
      .catch(console.error);

  }

  var triggeredObject = rule.triggeredRules

  for (var key in triggeredObject) {
    var active = {
      stan: rule.stan,
      rule_type: key,
      count: triggeredObject[key]
    }

    global.db('triggered_rules')
      .insert(active)
      .returning('*')
      .bind(console)
      .catch(console.error);

  }

  var activeObject = rule.activeRules

  for (var key in activeObject) {
    var triggered = {
      stan: rule.stan,
      rule_type: key,
      count: activeObject[key]
    }


    global.db('active_rules')
      .insert(triggered)
      .returning('*')
      .bind(console)
      .catch(console.error);

  }
}