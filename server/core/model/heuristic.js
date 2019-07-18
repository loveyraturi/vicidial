const createRawQuery = require('../config/sqlGrammer').createRawQuery
const accumulatorProcess = require('../services/accumulatorProcess')

module.exports.fetchHeuristicRuleByType = async function (value) {
  return global.db.select('rule_type', global.db.raw(createRawQuery('group_concat', Array('rule')) + " as rule"))
    .from('heuristic_rules')
    .where({ status: 1 })
    .groupBy('rule_type')
}
module.exports.updateRuleValidity = function (data, response) {
  global.db('heuristic_rules')
    .update(data)
    .where({ name: data.name })
    .then(function () {
      response({ status: true })
    })
    .catch(function () {
      response({ status: false })
    })
}
module.exports.updateRuleStatus = function (data, response, ruleType = '', rule_for) {

  global.db('heuristic_rules')
    .update(data)
    .where({ name: data.name })
    .then(function () {
      accumulatorProcess.updateRulesOfEngine(ruleType)
      response({ status: true })
    })
    .catch(function (error) {
      console.log(error)
      response({ status: false })
    })
}
module.exports.fetchHeuristicRulesForEngine = function () {
  return global.db.select('rule_type', global.db.raw(createRawQuery('group_concat', Array('rule')) + " as rule"))
   .from('heuristic_rules')
   .where({ status: 1 })
   .groupBy('rule_type')
}
module.exports.insertHeuristicRuleFld = (data) => {
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
}

module.exports.insertHeuristicMLFld = (data) => {
  global.db('heuristic_field')
    .insert(data)
    .returning('*')
    .bind(console)
    .then((res) => {
      let fieldId = res[0]
      let data1 = {
        "fieldid": fieldId,
        "defination": '{"compare": {"compareType": "Equal|Not Equal|Greater Than|Less Than","type": "text"}}'
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
}

module.exports.insertHeuristicMLFldCustom = (data) => {
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
}

module.exports.updateHeuristicFldMl = (data) => {
  global.db('heuristic_field')
    .where('field', '=', data.field)
    .update(data)
    .then((res, err) => {
      if (err) return console.error("error: " + err.msg);
    })
}
module.exports.findHeuristic = () => {
  return global.db.select([
    '*',
    { pojofieldid: 'fieldid' },
  ])
    .from('heuristic_field as field')
    .leftJoin('heuristic_field_def', 'heuristic_field_def.fieldid', 'field.id')
    .where({ active: 1 })
    .orderBy('orderindex', 'desc')
}

module.exports.getHeuristicByValue = function (value) {

  return global.db.select('id', 'name', 'rule', 'description', 'structure', 'rule_type', 'response', 'status', 'rule_for', 'date_from', 'date_to', 'lastmodifieddate', 'lastactivationdate')
    .from('heuristic_rules').as('heuristic_rules')
    .where({ id: value })

}

module.exports.getHeuristicByName = function (name) {

  return global.db.select('id', 'name', 'rule', 'description', 'structure', 'rule_type', 'response', 'status', 'rule_for', 'date_from', 'date_to', 'lastmodifieddate', 'lastactivationdate')
    .from('heuristic_rules').as('heuristic_rules')
    .where({ name: name })

}

module.exports.getInactiveHeuristics = function (value) {
  return global.db.select('id', 'name', 'rule', 'description', 'structure', 'rule_type', 'response', 'status', 'rule_for', 'date_from', 'date_to', 'lastmodifieddate', 'lastactivationdate', 'isvalid')
    .from('heuristic_rules').as('heuristic_rules')
    .where({ status: 0, rule_for: value })
    .orderBy('id', 'desc')
}

module.exports.getActiveHeuristics = function (value) {
  return global.db.select('id', 'name', 'rule', 'description', 'structure', 'rule_type', 'response', 'status', 'rule_for', 'date_from', 'date_to', 'lastmodifieddate', 'lastactivationdate', 'isvalid', 'statussandbox')
    .from('heuristic_rules').as('heuristic_rules')
    .where({ status: 1, rule_for: value })
    .orderBy('id', 'desc')
}

module.exports.getHeuristicFieldDetails = (fieldId) => {
  console.log("--------",fieldId)
  return global.db.select('field', 'locale', 'type as dataType', 'ref_id as ref_id', 'fieldtype as fieldType', 'active as active').from('heuristic_field')
    .where({ id: fieldId })
}

module.exports.getheuristicFieldDetailsByField = (field) => {
  return global.db.select('id', 'locale', 'type as dataType').from('heuristic_field')
    .where({ 
      field: field,
      active: 1
    })
}

module.exports.insertHeuristic = function (heuristic, response) {

  global.db('heuristic_rules')
    .insert(heuristic)
    .returning('*')
    .bind(console)
    .then(() => {
      response({ status: true })
    })
    .catch(console.error);
}

module.exports.updateHeuristic = function (rule, response) {
  global.db('heuristic_rules')
    .where('name', '=', rule.name)
    .update(rule)
    .then((res, err) => {
      if (err) return console.error("error: " + err.msg);
      response({ status: true })
    })
}