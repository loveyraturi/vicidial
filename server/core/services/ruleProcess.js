//const mongoos = require('mongoose');
var rulecategory = require('../model/rulecategory');
var rulecategory = require('../model/ruleresources');
var heuristic = require('../model/heuristic')

var rules = require('../model/ruleset')
var accumulator = require('../model/accumulators')
var featureObj = require('../model/feature')
var heuristicModel = require('../model/heuristic')
var ruleStructure = require('../config/ruleStructure')
const sqlGrammer = require('../config/sqlGrammer')
var restClient = require('node-rest-client').Client;
var responseAccuireIncommingMessageArray = new Array();
var responseIssuerIncommingMessageArray = new Array();
var responseAccuireRules = new Array();
var responseIssuerRules = new Array();
global.responseAccuireIncommingMessageArray = responseAccuireIncommingMessageArray
global.responseIssuerIncommingMessageArray = responseIssuerIncommingMessageArray
global.responseAccuireRules = responseAccuireRules
global.responseIssuerRules = responseIssuerRules

module.exports.transactionField = (pojo, sendResponse) => {
  rules.getTransactionField(pojo).then(sendResponse)
}

function getTransactionFieldName(transactionField) {

  return new Promise(resolve => {
    rules.getTransactionFieldDetails(transactionField).then((response) => {


      transactionFieldName = response[0].field;
      ruleLocale = response[0].locale;
      dataType = response[0].dataType;
      featurerefid = response[0].featurerefid
      resolve({
        transactionFieldName: transactionFieldName,
        ruleLocale: ruleLocale,
        dataType: dataType,
        featurerefid: featurerefid
      });
    })
  })
}

module.exports.updateRuleStatus = async (ruleReq, sendResponse) => {
  const result = {
    name: ruleReq.rulename,
    status: ruleReq.status
  };
  
  var featureStatus = true
  var heuristicFld = ruleReq.rulename.trim().toLowerCase().replace(/ /g, '_')
  // Check Validation used in Heuristic\

  if (result.status == 0) {
    // Collect all active heuristic
    let allActiveHeuristic = await heuristicModel.getActiveHeuristics('accuire');
    await Promise.all(allActiveHeuristic.map(async (heuristicRule) => {
      let ruleStructureObj = JSON.parse(heuristicRule.structure)
      var ruleElements = ruleStructureObj.rulesetArray[0].element

      ruleStructureObj.rulesetArray[0].element = await Promise.all(ruleElements.map(async (element, key) => {
        if (element.ruleOn == 'activerule' && featureStatus) {
          // Get the reference field Info
          let transactionField = element.transactionField
          let fieldDetails = await heuristicModel.getHeuristicFieldDetails(transactionField)
          let fieldName = fieldDetails[0].field
          featureStatus = (fieldName == heuristicFld) ? false : true
          if (!featureStatus) {
            sendResponse({
              response: "Used in " + ruleStructureObj.ruletype + ", name as " + ruleStructureObj.rulename,
              status: false
            })
          }
        }
      }))
    }))
  }
  if (featureStatus) {
    if (result.status == 1) {
      result.lastActivationDate = ruleReq.lastActivationDate;
    }
    rules.updateRuleStatus(result, sendResponse, ruleReq.ruletype, ruleReq.rule_for)
  }
}
module.exports.updateCustomRuleStatus = async (ruleReq, sendResponse) => {
  const result = {
    name: ruleReq.rulename,
    status: ruleReq.status
  };
  rules.updateCustomRuleStatus(result, sendResponse, ruleReq.rule_for)
}

module.exports.updateRuleValidity = async (ruleReq, sendResponse) => {
  //console.log("#@#$$#@$#updateRuleValidity")
  const result = {
    name: ruleReq.rulename,
    isvalid: ruleReq.isValid
  };
  //console.log("result",result)
  rules.updateRuleValidity(result, sendResponse)
}
module.exports.updateCustomRuleValidity = async (ruleReq, sendResponse) => {
  const result = {
    name: ruleReq.rulename,
    isvalid: ruleReq.isValid
  };
  console.log("result", result)
  rules.updateCustomRuleValidity(result, sendResponse)
}
module.exports.ruleLive = async (ruleReq, sendResponse) => {
  // Process rule information
  var { ruleId, statussandbox } = ruleReq
  // Fetching rule details
  var ruleDetails = await rules.getRuleByValue(ruleId)
  var ruleStructureObj = JSON.parse(ruleDetails[0].structure)
  var ruleElements = ruleStructureObj.rulesetArray[0].element
  //convert json structure to respective key
  var modifiedRuleElements = Array()

  ruleStructureObj.rulesetArray[0].element = await Promise.all(ruleElements.map(async (element, key) => {
    let transactionFldDetails = await rules.getTransactionFieldDetails(element.transactionField)
    element.transactionField = transactionFldDetails[0].field
    return element
  }))

  // Syncking with production server
  let sandBoxUrl = process.env.PRODUCTION_HOST_API + "/rule/createruleproduction";

  var args = {
    data: JSON.stringify(ruleStructureObj),
    headers: {
      "Content-Type": 'application/json'
    }
  };

  var client = new restClient()
  var req = client.post(sandBoxUrl, args, (data, response) => {
    if (data.status) {
      let ruleData = {
        name: ruleDetails[0].name,
        statussandbox: 1
      }
      rules.updateRule(ruleData, sendResponse) // Update Rule
    }
    else {
      sendResponse(data)
    }

    // var dataUpdateAccumulator = {
    //   name: featureName,
    //   statussandbox: 1
    // }
    // accumulators.updateAccumulator(dataUpdateAccumulator, finalResponse)
  });


}

module.exports.fetchRules = (value, sendResponse) => {
  rules.getRules(value).then(sendResponse)
  //console.log("sendResponse",sendResponse);
}

module.exports.fetchCustomRules = (value, sendResponse) => {
  rules.fetchCustomRules(value).then(sendResponse)
}

module.exports.fetchInactiveRules = (value, sendResponse) => {
  rules.getInactiveRules(value).then(sendResponse)
}
module.exports.getCustomInactiveRules = (value, sendResponse) => {
  rules.getCustomInactiveRules(value).then(sendResponse)
}

module.exports.fetchRuleByValue = (value, sendResponse) => {
  rules.getRuleByValue(value).then(sendResponse)
}
module.exports.fetchCustomRuleByValue = (value, sendResponse) => {
  rules.fetchCustomRuleByValue(value).then(sendResponse)
}

module.exports.engineStatus = (sendResponse) => {
  rules.engineStatus().then(sendResponse)
}
module.exports.onEngineStartup = (sendResponse) => {
  rules.onEngineStartup(sendResponse)
}
module.exports.onEngineShutdown = (sendResponse) => {
  rules.onEngineShutdown(sendResponse)
}
module.exports.fetchRulesForEngine = async (sendResponse) => {
  let allRule = await rules.fetchRulesForEngine()
  let heuristicRule = await heuristic.fetchHeuristicRulesForEngine()
  allRule.push(heuristicRule[0])
  var filteredRule = allRule.filter(function (el) {
    return el != null;
  });
  sendResponse(filteredRule)
  //rules.fetchRulesForEngine().then(sendResponse)
}
module.exports.fetchCustomRulesForEngine = (sendResponse) => {
  rules.fetchCustomRulesForEngine().then(sendResponse)
}
module.exports.getObjectsByvalue = (value, sendResponse) => {
  rules.getObjectsByvalue(value, sendResponse)
}
module.exports.getObjectsByvaluePromis = (value, type) => {
  return new Promise(async function (resolve) {
    rules.getObjectsByvaluePromis(value, type, await function (response) {

      response = response;

      resolve({
        response: response
      });
    })
  })

}
module.exports.getCardObjectsByvalue = (value, sendResponse) => {
  rules.getCardObjectsByvalue(value, sendResponse)
}
module.exports.getMerchantObjectsByvalue = (value, sendResponse) => {
  rules.getMerchantObjectsByvalue(value, sendResponse)
}
module.exports.fetchRulesForEngineByType = (rule_for, sendResponse) => {
  rules.fetchRulesForEngineByType(rule_for).then(sendResponse)
}

function getAllAccumulator(transactionField) {
  return new Promise(resolve => {
    accumulator.getAccumulatorList(transactionField).get((err, response) => {
      ruleLocale = response[0].locale;
      content = response[0].content;
      resolve({
        transactionFieldName: ruleLocale,
        ruleLocale: content
      });
    })
  })
}

function getAccumulatorByName(name) {
  return new Promise(resolve => {
    accumulator.getAccumulatorByName(name).then((response) => {
      ruleLocale = response[0].locale;
      content = response[0].content;
      resolve({
        transactionFieldName: ruleLocale,
        ruleLocale: content
      });
    })
  })
}

module.exports.fetchCountOfActiveRules = (rule_for, sendResponse) => {
  rules.getCountOfActiveRules(rule_for).then(sendResponse)
}
module.exports.fetchCountOfAllRules = (rule_for, sendResponse) => {
  rules.getCountOfAllRules(rule_for).then(sendResponse)
}
module.exports.fetchCountOfInactiveRules = (rule_for, sendResponse) => {
  rules.getCountOfInactiveRules(rule_for).then(sendResponse)
}

module.exports.createruleproduction = async function (ruleStructureObj, sendResponse) {
  // ruleConf is an object. Need to convert configuration field into id
  var ruleElements = ruleStructureObj.rulesetArray[0].element
  //convert json structure to respective key
  var modifiedRuleElements = Array()

  var featureStatus = true

  ruleStructureObj.rulesetArray[0].element = await Promise.all(ruleElements.map(async (element, key) => {
    let transactionFldDetails = await rules.getTransactionFieldDetailsByField(element.transactionField)

    if (!transactionFldDetails[0]) {
      sendResponse({
        response: element.transactionField + " feature should be active in production system",
        status: false
      })
      featureStatus = false
    }
    element.transactionField = transactionFldDetails[0] != undefined ? transactionFldDetails[0].id : null
    return element
  }))

  if (featureStatus) {
    module.exports.createRule(ruleStructureObj, sendResponse)
  }
}

module.exports.createRule = async function (ruleConf, sendResponse) {
  //console.log(ruleConf)
  //console.log("preview#@#@#@#@#@#@3",ruleConf.preview)
  if (!ruleConf.rule) {
    var ruleName = ruleConf.rulename;
    var response = ruleConf.response;
    var finalRule = ruleStructure.structure;
    finalRule = finalRule.replace(/%rulename%/g, ruleName);
    finalRule = finalRule.replace("%response%", response);
    // Rule Configuration Start
    var rulesetArray = ruleConf.rulesetArray;
    var finalResults = await Promise.all(rulesetArray.map(async function (ruleset) {
      elements = ruleset.element
      var operator = (typeof ruleset.operator !== 'undefined') ? ruleset.operator : '&&'
      var arr = Array()
      var results = await Promise.all(elements.map(async (element) => {
        //await callAsynchronousOperation(item);
        var {
          transactionField,
          operator,
          compareValue,
          ruleOn,
          devider
        } = element

        devider = !devider ? 1 : devider

        var ruleSignature = ruleStructure.allCondition[operator]
        var allConditionForFeature = ruleStructure.allConditionForFeature[operator]
        var allConditionForFeatureString = ruleStructure.allConditionForFeatureString[operator]

        var transactionFieldName, ruleLocale
        let result = transactionField != "" ? await getTransactionFieldName(transactionField) : null;

        if (result != null) {
          transactionFieldName = result.transactionFieldName
          ruleLocale = result.ruleLocale
          dataType = result.dataType
          featurerefid = result.featurerefid


          var compareStr = compareValue
          if (ruleOn == 'featureComparison') {


            var compareFld = compareValue != "" ? await getTransactionFieldName(compareValue) : null;
            var replaceInfo = {}
            var compareWith = compareFld.transactionFieldName
            if (operator == 'In' || operator == 'Not in') {

              var featureDetails = await featureObj.getFeatureDetails(featurerefid)
              var configurationObj = JSON.parse(featureDetails[0].configuration)
              var configurationList = "'"+configurationObj[0].value.split(',').join("','")+"'"
              compareWith = configurationList
            }


            if (compareFld.dataType == 'string') {
              replaceInfo = {
                pojoField: transactionFieldName,
                compareWith: compareWith,
                fieldVar: ruleLocale.split(' ').join('_'),
                '%': ''
              };

              ruleSignature = allConditionForFeatureString.replace(/pojoField|compareWith|fieldVar|%/gi, function (matched) {
                return replaceInfo[matched];
              });
            }

            if (compareFld.dataType == 'integer') {
              replaceInfo = {
                pojoField: transactionFieldName,
                compareWith: compareFld.transactionFieldName,
                fieldVar: ruleLocale.split(' ').join('_'),
                devider: devider,
                '%': ''
              };

              ruleSignature = allConditionForFeature.replace(/pojoField|compareWith|fieldVar|devider|%/gi, function (matched) {
                return replaceInfo[matched];
              });
            }

          }

          if (ruleOn == 'custom') {

            if (Array.isArray(compareValue)) {
              let compareIndex = compareValue.map((value) => value.item_id)
              compareStr = (dataType == 'integer') ? compareIndex.join(",") : "'" + compareIndex.join("','") + "'"
            } else {
              compareStr = (dataType == 'integer') ? compareStr : "'" + compareStr + "'"
            }
            var replaceInfo = {
              pojoField: transactionFieldName,
              compareWith: compareStr,
              fieldVar: ruleLocale.split(' ').join('_'),
              '%': ''
            };

            ruleSignature = ruleSignature.replace(/pojoField|compareWith|fieldVar|%/gi, function (matched) {
              return replaceInfo[matched];
            });
          }
        }
        return "(" + ruleSignature + ")"

      }));
      let singleStatement = results.join(' ' + operator + ' ')
      singleStatement = (typeof ruleset.boolian !== 'undefined') ? ruleset.boolian + '(' + singleStatement + ')' : singleStatement
      if (elements[0].ruleOn == 'history') {
        return "eval(" + singleStatement + ")"
      } else {
        //$mss:Map(this["DOW"]=="7") 
        return "$mss:Map(" + singleStatement + ")"
      }
    }))

    let finalResultStr = finalResults.join(";" + String.fromCharCode(10)) + ";"

    //ruleConf
    finalRule = finalRule.replace("%ruleConf%", finalResultStr)
    //console.log("finalRUle ##################33",finalRule)
    if (ruleConf.preview) {
      sendResponse({ final_rule: finalRule })
    } else {
      const result = {
        name: ruleConf.rulename,
        rule: finalRule,
        description: ruleConf.description,
        structure: JSON.stringify(ruleConf),
        rule_type: ruleConf.ruletype,
        response: ruleConf.response,
        status: 0,
        rule_for: ruleConf.rule_for,
        lastmodifieddate: sqlGrammer.configureDateTime(ruleConf.lastModifiedDate)
      };
      const heuristicFld = {
        field: ruleConf.rulename.trim().toLowerCase().replace(/ /g, '_'),
        dbfield: ruleConf.rulename.trim().toLowerCase().replace(/ /g, '_'),
        type: 'string',
        locale: ruleConf.rulename,
        orderindex: 2,
        active: 0,
        fieldtype: 'rule',
        source: '/rule/getruleoutput'
      }
      rules.insertRule(result, sendResponse, heuristicFld)

      //demoProcess.updateRulesOfEngine(ruleConf.ruletype)
    }

  } else {
    ruleConf.rulename = (ruleConf.rule).match('Rule(.*)"')[1]
    var finalRule
    if (ruleConf.response != "") {
      finalRule = ruleConf.rule
      finalRule = finalRule + "\n" + "modify($response){ \n setRulesResponse(\"test1\", " + ruleConf.response + ");    \n } \n end"

    } else {
      finalRule = ruleConf.rule
    }
    if (ruleConf.preview) {
      sendResponse({ final_rule: finalRule })
    } else {
      const result = {
        name: ruleConf.rulename,
        rule: finalRule,
        description: ruleConf.description,
        structure: JSON.stringify(ruleConf),
        rule_type: ruleConf.ruletype,
        response: ruleConf.response,
        status: 1,
        rule_for: ruleConf.rule_for,
        date_from: sqlGrammer.configureDateTime(ruleConf.from_date),
        date_to: sqlGrammer.configureDateTime(ruleConf.to_date),
        lastmodifieddate: sqlGrammer.configureDateTime(ruleConf.lastModifiedDate)
      };

      //  console.log(result)
      rules.insertRule(result, sendResponse)
    }
    //  demoProcess.updateRulesOfEngine(ruleConf.ruletype)
  }

}


module.exports.createMLFld = (request, sendResponse) => {
  const heuristicFld = {
    field: request.fldname.trim().toLowerCase().replace(/ /g, '_'),
    dbfield: request.fldname.trim().toLowerCase().replace(/ /g, '_'),
    type: 'integer',
    locale: request.fldname,
    orderindex: 2,
    active: 1,
    fieldtype: 'ml'
  }
  heuristic.insertHeuristicMLFld(heuristicFld)
  sendResponse({ status: true })
}

module.exports.createManualRule = function (request, sendResponse) {
  var finalrule = ""
  const result = {
    name: request.rulename,
    rule: finalrule,
    description: request.description,
    structure: "",
    rule_type: request.ruletype,
    response: request.response,
    status: 0,
    ismanual: 1,
    rule_for: request.rule_for,
    lastmodifieddate: sqlGrammer.configureDateTime(ruleConf.lastModifiedDate)
  };
  //console.log("#########################",result)
  //  rules.insertRule(result, sendResponse)
}

module.exports.createCustomRule = function (request, sendResponse) {
  result = {
    name: request.rulename,
    rule_for: request.ruleFor,
    query: request.query,
    response: request.response,
    status: request.status,
    customeoperations: JSON.stringify(request.customeOperations),
    description: request.description
  }
  console.log("result", result)
  rules.insertCustomeRule(result, sendResponse)
}
module.exports.updateCustomRule = function (request, sendResponse) {
  console.log(request, "request")
  result = {
    name: request.rulename,
    rule_for: request.ruleFor,
    query: request.query,
    response: request.response,
    status: request.status,
    customeoperations: JSON.stringify(request.customeOperations),
    description: request.description
  }
  //console.log("result",result)
  rules.updateCustomRule(result, request.id, sendResponse)
}

module.exports.updateRule = async function (ruleConf, sendResponse) {
  //console.log(ruleConf)
  //console.log("rule",ruleConf.rule)
  if (!ruleConf.rule) {
    var ruleName = ruleConf.rulename;
    var response = ruleConf.response;
    var finalRule = ruleStructure.structure;
    finalRule = finalRule.replace(/%rulename%/g, ruleName);
    finalRule = finalRule.replace("%response%", response);
    // Rule Configuration Start
    var rulesetArray = ruleConf.rulesetArray;
    var finalResults = await Promise.all(rulesetArray.map(async function (ruleset) {
      elements = ruleset.element
      var operator = (typeof ruleset.operator !== 'undefined') ? ruleset.operator : '&&'
      var arr = Array()
      var results = await Promise.all(elements.map(async (element) => {
        //await callAsynchronousOperation(item);
        let {
          transactionField,
          operator,
          compareValue,
          ruleOn,
          devider
        } = element

        devider = !devider ? 1 : devider
        let ruleSignature = ruleStructure.allCondition[operator]
        var allConditionForFeature = ruleStructure.allConditionForFeature[operator]

        var allConditionForFeatureString = ruleStructure.allConditionForFeatureString[operator]
        var transactionFieldName, ruleLocale

        let result = transactionField != "" ? await getTransactionFieldName(transactionField) : null;
        if (result != null) {
          transactionFieldName = result.transactionFieldName
          ruleLocale = result.ruleLocale
          dataType = result.dataType


          var compareStr = compareValue

          if (ruleOn == 'featureComparison') {

            let compareFld = compareValue != "" ? await getTransactionFieldName(compareValue) : null;
            var replaceInfo = {}
            if (compareFld.dataType == 'string') {
              replaceInfo = {
                pojoField: transactionFieldName,
                compareWith: compareFld.transactionFieldName,
                fieldVar: ruleLocale.split(' ').join('_'),
                '%': ''
              };

              ruleSignature = allConditionForFeatureString.replace(/pojoField|compareWith|fieldVar|%/gi, function (matched) {
                return replaceInfo[matched];
              });
            }

            if (compareFld.dataType == 'integer') {
              replaceInfo = {
                pojoField: transactionFieldName,
                compareWith: compareFld.transactionFieldName,
                fieldVar: ruleLocale.split(' ').join('_'),
                devider: devider,
                '%': ''
              };

              ruleSignature = allConditionForFeature.replace(/pojoField|compareWith|fieldVar|devider|%/gi, function (matched) {
                return replaceInfo[matched];
              });
            }

          }

          if (ruleOn == 'custom') {

            if (Array.isArray(compareValue)) {
              let compareIndex = compareValue.map((value) => value.item_id)
              compareStr = (dataType == 'integer') ? compareIndex.join(",") : "'" + compareIndex.join("','") + "'"
            } else {
              compareStr = (dataType == 'integer') ? compareStr : "'" + compareStr + "'"
            }
            var replaceInfo = {
              pojoField: transactionFieldName,
              compareWith: compareStr,
              fieldVar: ruleLocale.split(' ').join('_'),
              '%': ''
            };

            ruleSignature = ruleSignature.replace(/pojoField|compareWith|fieldVar|%/gi, function (matched) {
              return replaceInfo[matched];
            });
          }

          ruleSignature = ruleSignature.replace(/pojoField|compareWith|fieldVar|%/gi, function (matched) {
            //console.log("ruleSignature",ruleSignature)
            return replaceInfo[matched];
          });
        }
        return "(" + ruleSignature + ")"
      }));
      let singleStatement = results.join(' ' + operator + ' ')
      singleStatement = (typeof ruleset.boolian !== 'undefined') ? ruleset.boolian + '(' + singleStatement + ')' : singleStatement
      //console.log(singleStatement,"singleStatement4343434344#$#$#$#$#")

      if (elements[0].ruleOn == 'history') {
        return "eval(" + singleStatement + ")"
      } else {
        return "$mss:Map(" + singleStatement + ")"
      }

    }));
    let finalResultStr = finalResults.join(";" + String.fromCharCode(10)) + ";"

    //ruleConf
    finalRule = finalRule.replace("%ruleConf%", finalResultStr)

    //console.log("finalRule$#@#$@#$@$#@$#",finalRule)
    if (ruleConf.preview) {
      sendResponse({ final_rule: finalRule })
    } else {
      const result = {
        name: ruleConf.rulename,
        rule: finalRule,
        description: ruleConf.description,
        structure: JSON.stringify(ruleConf),
        rule_type: ruleConf.ruletype,
        response: ruleConf.response,
        status: 0,
        rule_for: ruleConf.rule_for,
        date_from: sqlGrammer.configureDateTime(ruleConf.from_date),
        date_to: sqlGrammer.configureDateTime(ruleConf.to_date),
        lastmodifieddate: sqlGrammer.configureDateTime(ruleConf.lastModifiedDate)
      };
      rules.updateRule(result, sendResponse)
    }
  } else {
    ruleConf.rulename = (ruleConf.rule).match('Rule(.*)"')[1]
    //console.log("ruleConf.rulename",ruleConf.rulename)
    var finalRule
    if (ruleConf.response != "") {
      finalRule = ruleConf.rule
      finalRule = finalRule + "\n" + "modify($response){ \n setRulesResponse(\"test1\", " + ruleConf.response + ");    \n } \n end"
      //console.log(finalRule)
    } else {
      finalRule = ruleConf.rule
    }
    if (ruleConf.preview) {
      sendResponse({ final_rule: finalRule })
    } else {
      const result = {
        name: ruleConf.rulename,
        rule: finalRule,
        description: ruleConf.description,
        structure: JSON.stringify(ruleConf),
        rule_type: ruleConf.ruletype,
        response: ruleConf.response,
        status: 0,
        rule_for: ruleConf.rule_for,
        date_from: sqlGrammer.configureDateTime(ruleConf.from_date),
        date_to: sqlGrammer.configureDateTime(ruleConf.to_date),
        lastmodifieddate: sqlGrammer.configureDateTime(ruleConf.lastModifiedDate)
      };

      rules.updateRule(result, sendResponse)
    }
  }

}
module.exports.fieldDetails = (fieldId, sendResponse) => {
  rules.getTransactionFieldDetails(fieldId).then(sendResponse)
  //console.log(global.db.last_query());
}


module.exports.ruleCategory = function (sendResponse) {
  var id = mongoos.Types.ObjectId('5b0d253d8ca44a62a4bf3371');
  var objRules = new rules({
    rule_category: id
  });
  objRules.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved');
    }
  });
  rulecategory.find(function (err, data) {
    if (err) return handleError(err);
    sendResponse({
      data: data
    })
  });
}

module.exports.ruleResources = function (sendResponse) {
  var id = mongoos.Types.ObjectId('5b0d253d8ca44a62a4bf3371');
  var objRules = new rules({
    rule_category: id
  });
  objRules.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved');
    }
  });
  rulecategory.find(function (err, data) {
    if (err) return handleError(err);
    sendResponse({
      data: data
    })
  });
}

module.exports.singleRule = function (sendResponse) {
  var id = mongoos.Types.ObjectId('5b0d253d8ca44a62a4bf3371');
  var objRules = new rules({
    rule_category: id
  });
  objRules.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved');
    }
  });
  rulecategory.find(function (err, data) {
    if (err) return handleError(err);
    sendResponse({
      data: data
    })
  });
}


module.exports.RuleDetails = function (sendResponse) {
  var id = mongoos.Types.ObjectId('5b0d253d8ca44a62a4bf3371');
  var objRules = new rules({
    rule_category: id
  });
  objRules.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved');
    }
  });
  rulecategory.find(function (err, data) {
    if (err) return handleError(err);
    sendResponse({
      data: data
    })
  });
}

module.exports.insertResponse = async (ruleReq, sendResponse) => {
  var incomming_message = JSON.parse(ruleReq.Incomming_Trx.incomming_message)
  global.responseIssuerIncommingMessageArray.push(incomming_message)

  const result = {
    card_no: incomming_message.primaryAccountNumber,
    merchantsType: incomming_message.merchantsType,
    date_time: incomming_message.transmissionDateAndTime,
    stan: incomming_message.systemTraceAuditNumber,
    location: "",
    response_for: "",
    rulesResponse: ruleReq.Rules_Response,
    activeRules: ruleReq.Active_Rules,
    triggeredRules: ruleReq.Triggered_Rules,
  };
  rules.insertResponse(result, sendResponse)
  global.responseIssuerRules.push(result)

  const incommingTrx = {
    msgType: incomming_message.msgType,
    primaryAccountNumber: incomming_message.primaryAccountNumber,
    processingCode: incomming_message.processingCode,
    amountTransaction: incomming_message.amountTransaction,
    amountSettlement: incomming_message.amountSettlement,
    amountCardholderBilling: incomming_message.amountCardholderBilling,
    transmissionDateAndTime: incomming_message.transmissionDateAndTime,
    amountCardholderBillingFee: incomming_message.amountCardholderBillingFee,
    conversionRateSettlement: incomming_message.conversionRateSettlement,
    conversionRateCardholderBilling: incomming_message.conversionRateCardholderBilling,
    systemTraceAuditNumber: incomming_message.systemTraceAuditNumber,
    timeLocalTransaction: incomming_message.timeLocalTransaction,
    dateLocalTransaction: incomming_message.dateLocalTransaction,
    dateExpiration: incomming_message.dateExpiration,
    dateSettlement: incomming_message.dateSettlement,
    dateConversion: incomming_message.dateConversion,
    dateCapture: incomming_message.dateCapture,
    merchantsType: incomming_message.merchantsType,
    acquiringInstitutionCountryCode: incomming_message.acquiringInstitutionCountryCode,
    panExtendedCountryCode: incomming_message.panExtendedCountryCode,
    forwardingInstitutionCountryCode: incomming_message.forwardingInstitutionCountryCode,
    pointOfServiceEntryMode: incomming_message.pointOfServiceEntryMode,
    cardSequenceNumber: incomming_message.cardSequenceNumber,
    networkInternationalIdentifier: incomming_message.networkInternationalIdentifier,
    pointOfServiceConditionCode: incomming_message.pointOfServiceConditionCode,
    pointOfServicePinCaptureCode: incomming_message.pointOfServicePinCaptureCode,
    authorizationIdentification: incomming_message.authorizationIdentification,
    amountTransactionFee: incomming_message.amountTransactionFee,
    amountSettlementFee: incomming_message.amountSettlementFee,
    amountTransactionProcessingFee: incomming_message.amountTransactionProcessingFee,
    amountSettlementProcessingFee: incomming_message.amountSettlementProcessingFee,
    acquiringInstitutionIdentCode: incomming_message.acquiringInstitutionIdentCode,
    forwardingInstitutionIdentCode: incomming_message.forwardingInstitutionIdentCode,
    panExtended: incomming_message.panExtended,
    track2Data: incomming_message.track2Data,
    track3Data: incomming_message.track3Data,
    retrievalReferenceNumber: incomming_message.retrievalReferenceNumber,
    authorizationIdentificationResponse: incomming_message.authorizationIdentificationResponse,
    responseCode: incomming_message.responseCode,
    serviceRestrictionCode: incomming_message.serviceRestrictionCode,
    cardAcceptorTerminalIdentificacion: incomming_message.cardAcceptorTerminalIdentificacion,
    cardAcceptorIdentificationCode: incomming_message.cardAcceptorIdentificationCode,
    cardAcceptorNameOrLocation: incomming_message.cardAcceptorNameOrLocation,
    aditionalResponseData: incomming_message.aditionalResponseData,
    track1Data: incomming_message.track1Data,
    aditionalDataIso: incomming_message.aditionalDataIso,
    aditionalDataNational: incomming_message.aditionalDataNational,
    aditionalData: incomming_message.aditionalData,
    currencyCodeTransaction: incomming_message.currencyCodeTransaction,
    currencyCodeSettlement: incomming_message.currencyCodeSettlement,
    currencyCodeCardHolderBilling: incomming_message.currencyCodeCardHolderBilling,
    pinData: incomming_message.pinData,
    securityRelatedControlInformation: incomming_message.securityRelatedControlInformation,
    additionalAmounts: incomming_message.additionalAmounts,
    reservedIso55: incomming_message.reservedIso55,
    reservedIso56: incomming_message.reservedIso56,
    reservedNational57: incomming_message.reservedNational57,
    reservedNational58: incomming_message.reservedNational58,
    reservedNational59: incomming_message.reservedNational59,
    reserved60: incomming_message.reserved60,
    reserved61: incomming_message.reserved61,
    reserved62: incomming_message.reserved62,
    reserved63: incomming_message.reserved63,
    messageAuthenticationCodeField: incomming_message.messageAuthenticationCodeField,
    bitmapExtended: incomming_message.bitmapExtended,
    settlementCode: incomming_message.settlementCode,
    extendedPaymentCode: incomming_message.extendedPaymentCode,
    receivingInstitutionCountryCode: incomming_message.receivingInstitutionCountryCode,
    settlementInstitutionCountryCode: incomming_message.settlementInstitutionCountryCode,
    networkManagementInformationCode: incomming_message.networkManagementInformationCode,
    messageNumber: incomming_message.messageNumber,
    messageNumberLast: incomming_message.messageNumberLast,
    dateAction: incomming_message.dateAction,
    creditsNumber: incomming_message.creditsNumber,
    creditsReversalNumber: incomming_message.creditsReversalNumber,
    debitsNumber: incomming_message.debitsNumber,
    debitsReversalNumber: incomming_message.debitsReversalNumber,
    transferNumber: incomming_message.transferNumber,
    transferReversalNumber: incomming_message.transferReversalNumber,
    inquiriesNumber: incomming_message.inquiriesNumber,
    authorizationNumber: incomming_message.authorizationNumber,
    creditsProcessingFeeAmount: incomming_message.creditsProcessingFeeAmount,
    creditsTransactionFeeAmount: incomming_message.creditsTransactionFeeAmount,
    debitsProcessingFeeAmount: incomming_message.debitsProcessingFeeAmount,
    debitsTransactionFeeAmount: incomming_message.debitsTransactionFeeAmount,
    creditsAmount: incomming_message.creditsAmount,
    creditsReversalAmount: incomming_message.creditsReversalAmount,
    debitsAmount: incomming_message.debitsAmount,
    debitsReversalAmount: incomming_message.debitsReversalAmount,
    originalDataElements: incomming_message.originalDataElements,
    fileUpdateCode: incomming_message.fileUpdateCode,
    fileSecurityCode: incomming_message.fileSecurityCode,
    responseIndicator: incomming_message.responseIndicator,
    serviceIndicator: incomming_message.serviceIndicator,
    replacementAmounts: incomming_message.replacementAmounts,
    messageSecurityCode: incomming_message.messageSecurityCode,
    amountNetSettlement: incomming_message.amountNetSettlement,
    payee: incomming_message.payee,
    settlementInstitutionIdentCode: incomming_message.settlementInstitutionIdentCode,
    receivingInstitutionIdentCode: incomming_message.receivingInstitutionIdentCode,
    fileName: incomming_message.fileName,
    accountIdentification1: incomming_message.accountIdentification1,
    accountIdentification2: incomming_message.accountIdentification2,
    transactionDescription: incomming_message.transactionDescription,
    reservedIsoUse105: incomming_message.reservedIsoUse111,
    reservedIsoUse106: incomming_message.reservedIsoUse111,
    reservedIsoUse107: incomming_message.reservedIsoUse111,
    reservedIsoUse108: incomming_message.reservedIsoUse111,
    reservedIsoUse109: incomming_message.reservedIsoUse111,
    reservedIsoUse110: incomming_message.reservedIsoUse111,
    reservedIsoUse111: incomming_message.reservedIsoUse111,
    reservedNationalUse112: incomming_message.reservedNationalUse119,
    reservedNationalUse113: incomming_message.reservedNationalUse119,
    reservedNationalUse114: incomming_message.reservedNationalUse119,
    reservedNationalUse115: incomming_message.reservedNationalUse119,
    reservedNationalUse116: incomming_message.reservedNationalUse119,
    reservedNationalUse117: incomming_message.reservedNationalUse119,
    reservedNationalUse118: incomming_message.reservedNationalUse119,
    reservedNationalUse119: incomming_message.reservedNationalUse119,
    reservedUse120: incomming_message.reservedUse120,
    reservedUse121: incomming_message.reservedUse121,
    reservedUse122: incomming_message.reservedUse122,
    reservedUse123: incomming_message.reservedUse123,
    reservedUse124: incomming_message.reservedUse124,
    reservedUse125: incomming_message.reservedUse125,
    reservedUse126: incomming_message.reservedUse126,
    reservedUse127: incomming_message.reservedUse127,
    mac2: incomming_message.mac2,
  };
  rules.insertIncommingMessage(incommingTrx, sendResponse)


}

module.exports.insertResponseAcquirer = async (ruleReq, sendResponse) => {
  var incomming_message = JSON.parse(ruleReq.Incomming_Trx.incomming_message)
  global.responseAccuireIncommingMessageArray.push(incomming_message)
  const result = {
    card_no: incomming_message.primaryAccountNumber,
    merchantsType: incomming_message.merchantsType,
    date_time: incomming_message.transmissionDateAndTime,
    stan: incomming_message.systemTraceAuditNumber,
    location: "",
    response_for: "",
    rulesResponse: ruleReq.Rules_Response,
    activeRules: ruleReq.Active_Rules,
    triggeredRules: ruleReq.Triggered_Rules,
  };
  rules.insertResponse(result, sendResponse)
  global.responseAccuireRules.push(result)

  const incommingTrx = {
    msgType: incomming_message.msgType,
    primaryAccountNumber: incomming_message.primaryAccountNumber,
    processingCode: incomming_message.processingCode,
    amountTransaction: incomming_message.amountTransaction,
    amountSettlement: incomming_message.amountSettlement,
    amountCardholderBilling: incomming_message.amountCardholderBilling,
    transmissionDateAndTime: incomming_message.transmissionDateAndTime.toString(),
    amountCardholderBillingFee: incomming_message.amountCardholderBillingFee,
    conversionRateSettlement: incomming_message.conversionRateSettlement,
    conversionRateCardholderBilling: incomming_message.conversionRateCardholderBilling,
    systemTraceAuditNumber: incomming_message.systemTraceAuditNumber,
    timeLocalTransaction: incomming_message.timeLocalTransaction,
    dateLocalTransaction: incomming_message.dateLocalTransaction,
    dateExpiration: incomming_message.dateExpiration,
    dateSettlement: incomming_message.dateSettlement,
    dateConversion: incomming_message.dateConversion,
    dateCapture: incomming_message.dateCapture,
    merchantsType: incomming_message.merchantsType,
    acquiringInstitutionCountryCode: incomming_message.acquiringInstitutionCountryCode,
    panExtendedCountryCode: incomming_message.panExtendedCountryCode,
    forwardingInstitutionCountryCode: incomming_message.forwardingInstitutionCountryCode,
    pointOfServiceEntryMode: incomming_message.pointOfServiceEntryMode,
    cardSequenceNumber: incomming_message.cardSequenceNumber,
    networkInternationalIdentifier: incomming_message.networkInternationalIdentifier,
    pointOfServiceConditionCode: incomming_message.pointOfServiceConditionCode,
    pointOfServicePinCaptureCode: incomming_message.pointOfServicePinCaptureCode,
    authorizationIdentification: incomming_message.authorizationIdentification,
    amountTransactionFee: incomming_message.amountTransactionFee,
    amountSettlementFee: incomming_message.amountSettlementFee,
    amountTransactionProcessingFee: incomming_message.amountTransactionProcessingFee,
    amountSettlementProcessingFee: incomming_message.amountSettlementProcessingFee,
    acquiringInstitutionIdentCode: incomming_message.acquiringInstitutionIdentCode,
    forwardingInstitutionIdentCode: incomming_message.forwardingInstitutionIdentCode,
    panExtended: incomming_message.panExtended,
    track2Data: incomming_message.track2Data,
    track3Data: incomming_message.track3Data,
    retrievalReferenceNumber: incomming_message.retrievalReferenceNumber,
    authorizationIdentificationResponse: incomming_message.authorizationIdentificationResponse,
    responseCode: incomming_message.responseCode,
    serviceRestrictionCode: incomming_message.serviceRestrictionCode,
    terminalNumber: incomming_message.terminalNumber,
    merchantNumber: incomming_message.merchantNumber,
    merchantName: incomming_message.merchantName,
    merchantAddress: incomming_message.merchantAddress,
    track1Data: incomming_message.track1Data,
    lat: incomming_message.lat,
    log: incomming_message.log,
    region: incomming_message.region,
    serviceCode: incomming_message.serviceCode,
    eci: incomming_message.eci,
    close1: incomming_message.close1,
    close2: incomming_message.close2,
    v4: incomming_message.v4,
    approvalCode: incomming_message.approvalCode,
    reservedIso55: incomming_message.reservedIso55,
    reservedIso56: incomming_message.reservedIso56,
    reservedNational57: incomming_message.reservedNational57,
    reservedNational58: incomming_message.reservedNational58,
    reservedNational59: incomming_message.reservedNational59,
    reserved60: incomming_message.reserved60,
    reserved61: incomming_message.reserved61,
    reserved62: incomming_message.reserved62,
    reserved63: incomming_message.reserved63,
    messageAuthenticationCodeField: incomming_message.messageAuthenticationCodeField,
    bitmapExtended: incomming_message.bitmapExtended,
    settlementCode: incomming_message.settlementCode,
    bankName: incomming_message.bankName,
    bin: incomming_message.bin,
    typeCard: incomming_message.typeCard,
    merchantStatus: incomming_message.merchantStatus,
    messageNumber: incomming_message.messageNumber,
    messageNumberLast: incomming_message.messageNumberLast,
    dateAction: incomming_message.dateAction,
    creditsNumber: incomming_message.creditsNumber,
    creditsReversalNumber: incomming_message.creditsReversalNumber,
    debitsNumber: incomming_message.debitsNumber,
    debitsReversalNumber: incomming_message.debitsReversalNumber,
    transferNumber: incomming_message.transferNumber,
    transferReversalNumber: incomming_message.transferReversalNumber,
    inquiriesNumber: incomming_message.inquiriesNumber,
    authorizationNumber: incomming_message.authorizationNumber,
    creditsProcessingFeeAmount: incomming_message.creditsProcessingFeeAmount,
    creditsTransactionFeeAmount: incomming_message.creditsTransactionFeeAmount,
    debitsProcessingFeeAmount: incomming_message.debitsProcessingFeeAmount,
    debitsTransactionFeeAmount: incomming_message.debitsTransactionFeeAmount,
    creditsAmount: incomming_message.creditsAmount,
    creditsReversalAmount: incomming_message.creditsReversalAmount,
    debitsAmount: incomming_message.debitsAmount,
    debitsReversalAmount: incomming_message.debitsReversalAmount,
    originalDataElements: incomming_message.originalDataElements,
    fileUpdateCode: incomming_message.fileUpdateCode,
    fileSecurityCode: incomming_message.fileSecurityCode,
    responseIndicator: incomming_message.responseIndicator,
    serviceIndicator: incomming_message.serviceIndicator,
    replacementAmounts: incomming_message.replacementAmounts,
    messageSecurityCode: incomming_message.messageSecurityCode,
    amountNetSettlement: incomming_message.amountNetSettlement,
    payee: incomming_message.payee,
    settlementInstitutionIdentCode: incomming_message.settlementInstitutionIdentCode,
    receivingInstitutionIdentCode: incomming_message.receivingInstitutionIdentCode,
    fileName: incomming_message.fileName,
    accountIdentification1: incomming_message.accountIdentification1,
    accountIdentification2: incomming_message.accountIdentification2,
    transactionDescription: incomming_message.transactionDescription,
    reservedIsoUse105: incomming_message.reservedIsoUse111,
    reservedIsoUse106: incomming_message.reservedIsoUse111,
    reservedIsoUse107: incomming_message.reservedIsoUse111,
    reservedIsoUse108: incomming_message.reservedIsoUse111,
    reservedIsoUse109: incomming_message.reservedIsoUse111,
    reservedIsoUse110: incomming_message.reservedIsoUse111,
    reservedIsoUse111: incomming_message.reservedIsoUse111,
    reservedNationalUse112: incomming_message.reservedNationalUse119,
    reservedNationalUse113: incomming_message.reservedNationalUse119,
    reservedNationalUse114: incomming_message.reservedNationalUse119,
    reservedNationalUse115: incomming_message.reservedNationalUse119,
    reservedNationalUse116: incomming_message.reservedNationalUse119,
    reservedNationalUse117: incomming_message.reservedNationalUse119,
    reservedNationalUse118: incomming_message.reservedNationalUse119,
    reservedNationalUse119: incomming_message.reservedNationalUse119,
    reservedUse120: incomming_message.reservedUse120,
    reservedUse121: incomming_message.reservedUse121,
    reservedUse122: incomming_message.reservedUse122,
    reservedUse123: incomming_message.reservedUse123,
    reservedUse124: incomming_message.reservedUse124,
    reservedUse125: incomming_message.reservedUse125,
    reservedUse126: incomming_message.reservedUse126,
    reservedUse127: incomming_message.reservedUse127,
    mac2: incomming_message.mac2,
  };
  //console.log("incommingTrxAcquirer######## ",incommingTrx)
  rules.insertIncommingMessageAcquirer(incommingTrx, sendResponse)
}