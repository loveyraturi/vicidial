const SQLBuilder = require('json-sql-builder');
var restClient = require('node-rest-client').Client;
const ruleStructure = require('../config/ruleStructure')
const accumulatorStructure = require('../config/ruleStructure')
const ruleSetModel = require('../model/ruleset')
const customSetModel = require('../model/custom')
const ruleProcess = require('../services/ruleProcess')
const features = require('../model/feature')
var heuristicModel = require('../model/heuristic')
const durationObj = require('../model/duration')
const accumulators = require('../model/accumulators')
const rulesetObj = require('../model/ruleset')
var sqlbuilder = new SQLBuilder('mysql');
var joinCondition = Array()

var isDependentGlobal = 0

forRefTableConf = (transactionField) => {
  return new Promise(resolve => {
    ruleSetModel.getTransactionAllFieldDetails(transactionField).then(function (response) {
      refTable = response[0].reftable;
      resolve({
        refTable: refTable
      });
    })
  })
}

forCustomTableConf = (table, value) => {
  return new Promise(resolve => {
    customSetModel.getCustomTableInfo(table, value).then(function (response) {
      tablestructure = response[0].tablestructure;
      resolve({
        tablestructure: tablestructure
      });
    })
  })
}

forCustomAccuireTableConf = (table, value) => {
  return new Promise(resolve => {
    customSetModel.getCustomAccuireTableInfo(table, value).then(function (response) {
      tablestructure = response[0].tablestructure;
      resolve({
        tablestructure: tablestructure
      });
    })
  })
}



forJoinStatement = async (transactionField, value) => {

  let tableDetails = await forRefTableConf(transactionField)

  let table = tableDetails.refTable
  let customTableStructure = await forCustomTableConf(table, value)
  let {
    tablename,
    primarykey
  } = JSON.parse(customTableStructure.tablestructure)
  let mainTableRefField = 'ISOMESSAGEDEV.' + transactionField
  let refTableField = tablename + '.' + primarykey
  let joinObj = '"' + tablename + '": {      "$as": "' + tablename + '",      "$leftJoin": { "' + mainTableRefField + '": { "$eq": { "$column": "' + refTableField + '" } } }    }  '
  joinCondition.push(joinObj)
}


forJoinWhereCardStatement = async (configuration) => {
  let {
    transactionField,
    operator,
    compareValue,
    compareValueCond,
    transactionFieldforcard
  } = configuration
  let tablename = 'CARDTABLEDEV'
  let mainTableRefField = 'ISOMESSAGEDEV.' + transactionField
  let refTableField = 'CARDTABLEDEV.CARDNO'

  let joinObj = '"' + tablename + '": {      "$as": "' + tablename + '",      "$leftJoin": { "' + mainTableRefField + '": { "$eq": { "$column": "' + refTableField + '" } } }    }  '
  joinCondition.push(joinObj)
}

forJoinWhereMerchantStatement = async (configuration) => {
  let {
    transactionField,
    operator,
    compareValue,
    compareValueCond,
    transactionFieldforcard
  } = configuration
  let tablename = 'MERCHANTTABLEDEV'
  let mainTableRefField = 'ISOMESSAGEDEV.' + transactionField
  let refTableField = 'MERCHANTTABLEDEV.MERCHANTID'

  let joinObj = '"' + tablename + '": {      "$as": "' + tablename + '",      "$leftJoin": { "' + mainTableRefField + '": { "$eq": { "$column": "' + refTableField + '" } } }    }  '
  joinCondition.push(joinObj)
}

forInStatement = async (where) => {
  
  var whereStrArr = await Promise.all(where.compareValue.map(async (value) => {
    
    if (!isNaN(value.item_id)) {
      return where.transactionField + "='" + value.item_id + "'"
    } else {
      let refTable = await forRefTableConf(where.transactionField)
      console.log(refTable)
      if (refTable.refTable == null || refTable.refTable == '') {
        return where.transactionField + "='" + value.item_id + "'"
      }
      else {
        await forJoinStatement(where.transactionField, value.item_id)
      }
    }
  }))

  
  whereStrArr = whereStrArr.filter(Boolean)
  var whereStr = whereStrArr.join(' or ')
  return whereStr
}
getObjectsByvaluePromis = (value, type) => {
  return new Promise(async function (resolve) {
    rulesetObj.getObjectsByvaluePromis(value, type, await function (response) {

      response = response;

      resolve({
        response: response
      });
    })
  })
}

createWhere = async (wherePool) => {
  let data;
  let type;
  queryPool = await Promise.all(wherePool.map(async (where) => {
    if (where.element) {
      let whereArr = await createWhere(where.element)
      return whereArr.join(' ' + ruleStructure.sqlOperators[where.operator] + ' ')
    } else {
      data = await getObjectsByvaluePromis(1, where.transactionField)
      type = data.response[0].type
      if (where.operator == 'Compare Between') {
        forJoinWhereCardStatement(where)
        let syntax = ruleStructure.sqlAllCondition[where.compareValueCond]
        transactionField = 'ISOMESSAGEDEV.' + where.transactionFieldforcard
        compareValue = 'CARDTABLEDEV.' + where.compareValue
        if (syntax && where.compareValue && where.transactionFieldforcard) {
          syntax = syntax.replace('field', transactionField)
          syntax = syntax.replace('value', compareValue)
          return syntax.replace(/'/gi, '');
        }
      }
      if (Array.isArray(where.compareValue)) {
        return forInStatement(where)
      }
      let syntax = ruleStructure.sqlAllCondition[where.operator]
      if (syntax) {

        syntax = syntax.replace('field', where.transactionField)
        syntax = syntax.replace('value', where.compareValue)
        return type == "integer" ? syntax.replace(/'/g, '') : syntax
      }
    }
  }))
  return queryPool
}

createAccuireWhere = async (wherePool) => {
  
  let data;
  let type;

  queryPool = await Promise.all(wherePool.map(async (where) => {
    if (where.element) {
      let whereArr = await createAccuireWhere(where.element)
      return whereArr.join(' ' + ruleStructure.sqlOperators[where.operator] + ' ')
    } else {
      
      data = await getObjectsByvaluePromis(6, where.transactionField)
      
      type = data.response[0].type
      if (isDependentGlobal == 0) {
        isDependentGlobal = data.response[0].isdependent
      }
      if (where.operator == 'Compare Between') {
        forJoinWhereMerchantStatement(where)
        let syntax = ruleStructure.sqlAllCondition[where.compareValueCond]
        transactionField = 'ISOMESSAGEDEV.' + where.transactionFieldforcard
        compareValue = 'MERCHANTTABLEDEV.' + where.compareValue
        if (syntax && where.compareValue && where.transactionFieldforcard) {

          syntax = syntax.replace('field', transactionField)
          syntax = syntax.replace('value', compareValue)
          return syntax.replace(/'/gi, '');
        }
      }

      if (Array.isArray(where.compareValue)) {
        return forInStatement(where)
      }
      let syntax = ruleStructure.sqlAllCondition[where.operator]
      //console.log(type)
      if (syntax) {
        syntax = syntax.replace('field', where.transactionField)
        syntax = syntax.replace('value', where.compareValue)

        return type == "integer" ? syntax.replace(/'/g, '') : syntax
      }
    }
  }))
  return queryPool
}

module.exports.fetchAccumulators = (sendResponse) => {
  //accumulators.getAccumulatorList().get(sendResponse)
  accumulators.getAccumulatorList().then(sendResponse)
}
module.exports.fetchAccumulatorsByType = (accumulator_for, sendResponse) => {
  accumulators.getAccumulatorListByType(accumulator_for).then(sendResponse)
}
module.exports.fetchAccumulatorsByTypev1 = (accumulator_for, sendResponse) => {
  accumulators.getAccumulatorListByTypev1(accumulator_for).then((allData) => {

    var finalFeatureInfo = allData.map((data) => {

      //let finalQuery = "create table " + data.pojofieldid.replace(/ /g, "_") + " AS " + data.content;
      let finalQuery = data.content;
      var accumulatorForArr = JSON.parse(data.query_structure).accumulatorFor.map((accmulator) => accmulator.item_id)
      return {
        featue_name: data.pojofieldid.replace(/ /g, "_"),
        query: finalQuery,
        is_dependent: true,
        group_by: accumulatorForArr

      }
    })
    sendResponse(finalFeatureInfo)
  })
}
module.exports.fetchInactiveAccumulatorsByType = (accumulator_for, sendResponse) => {
  accumulators.getInactiveAccumulatorListByType(accumulator_for).then(sendResponse)
}
module.exports.fetchCountOfAllAccumulators = (accumulator_for, sendResponse) => {
  accumulators.getCountOfAllAccumulator(accumulator_for).then(sendResponse)
}
module.exports.fetchCountOfActiveAccumulators = (accumulator_for, sendResponse) => {
  accumulators.getCountOfActiveAccumulator(accumulator_for).then(sendResponse)
}
module.exports.fetchCountOfInactiveAccumulators = (accumulator_for, sendResponse) => {
  accumulators.getCountOfInactiveAccumulator(accumulator_for).then(sendResponse)
}

module.exports.fetchInactiveAccumulators = (sendResponse) => {
  accumulators.getInactiveAccumulatorList().then(sendResponse)
}

module.exports.fetchAccumulatorsByValue = (value, sendResponse) => {
  accumulators.getAccumulatorByValue(value).then(sendResponse)
}


module.exports.createAccumulator = async (accumulatorReq, sendResponse) => {
  let accumulatorFor = accumulatorReq.accumulatorFor.map((data) => data.item_id)
  let accumulatorFunction = accumulatorReq.accumulatorFunction
  let accumulatorFunctionOf = accumulatorReq.accumulatorFunctionOf
  let whereCondition = accumulatorReq.accumulatorsetArray
  let duration = accumulatorReq.duration
  let primaryOperator = accumulatorReq.operator
  var columns = []
  switch (accumulatorReq.accumulatorFunction) {
    case 'count':
      columns = [{
        $count: accumulatorFunctionOf
      }]
      break;
    case 'sum':
      columns = [{
        $sum: accumulatorFunctionOf
      }]
      break;
    case 'boolean':
      columns = [
        "1"
      ]
      break;
    case 'average':
      columns = [{
        $avg: accumulatorFunctionOf
      }]
      break;
    case 'topkdistinct':
      columns = [
        "TOPKDISTINCT(" + accumulatorFunctionOf + ",2)"
      ]
      break
  }

  columns = accumulatorFor.concat(columns)
  joinCondition = []
  var queryPool = await createWhere(whereCondition)
  //console.log(queryPool,"queryPool",data.type)
  let joinConditionAll = joinCondition.length > 0 ? "{" + joinCondition.join(",") + "}" : ""
  if (joinConditionAll != '') {
    var queryJson = {
      $select: {
        $columns: columns,
        $from: 'ISOMESSAGEDEV',
        $joins: JSON.parse(joinConditionAll),
        $groupBy: accumulatorFor,
      }
    }
  } else {
    var queryJson = {
      $select: {
        $columns: columns,
        $from: 'ISOMESSAGEDEV',
        $groupBy: accumulatorFor,
      }
    }
  }


  //console.log("queryJson",queryJson)
  var query = sqlbuilder.build(queryJson).sql
  var queryArr = query.split("GROUP")
  queryPool = queryPool.filter(Boolean)
  var whereCond = queryPool.length > 0 ? "where " + '(' + queryPool.join(') ' + ruleStructure.sqlOperators[primaryOperator] + ' (') + ')' : ""
  var finalQuery = accumulatorReq.accumulatorFunction == 'boolean' ? queryArr[0] + " WINDOW TUMBLING (" + duration + ") " + whereCond : queryArr[0] + " WINDOW TUMBLING (" + duration + ") " + whereCond + " GROUP" + queryArr[1]

  finalQuery = finalQuery.replace(/`/gi, '');
  finalQuery = finalQuery.replace(" AS ", ' ');
  var operators;
  operators = accumulatorReq.accumulatorFunction == 'boolean' ? "{ \"compare\": {\"compareType\": \"Equal|Not Equal\",\"type\": \"text\" }}" :
    "{ \"compare\": {\"compareType\": \"Equal|Not Equal|Greater Than|Less Than\",\"type\": \"text\" }}"
  if (accumulatorReq.preview) {
    sendResponse({
      final_query: finalQuery
    })
  } else {
    // console.log("finalQuery",finalQuery)
    demoProcess.updateAccumulatorOfEngine(accumulatorReq.accumulatorname, finalQuery)
    const result = {
      name: accumulatorReq.accumulatorname,
      query: finalQuery,
      field_type: accumulatorReq.accumulatorFunction,
      operators: operators,
      query_structure: JSON.stringify(accumulatorReq),
      description: accumulatorReq.description,
      accumulator_for: accumulatorReq.accumulator_for,
      status: 0
    };
    // console.log(demoProcess.validateAccumulatorQuery(finalQuery))
    accumulators.insertAccumulator(result, sendResponse)
  }
}

module.exports.updateRulesOfEngine = async function (rule_type) {
  console.log("calling update rule status")
  var res = rule_type == 'heuristic' ? heuristic.fetchHeuristicRuleByType(rule_type) : rules.fetchRuleByType(rule_type)
  res.then(function (response) {
    var responseRule = null
    if (response.length > 0) {
      responseRule = response[0].rule
    }
    var args = {
      data: {
        rule_type: rule_type,
        rule: responseRule
      },
      headers: {
        "Content-Type": 'application/json'
      }
    };
    console.log("argssss#######", args)
    var client = new restClient()
    let url = process.env.JAVA_RULE_ENGINE_URL_ACQUIRER + "/renoSecureAcquirer/updateRule";

    var req = client.post(url, args, ()=>{
      
    });
    req.on('requestTimeout', function (req) {
      console.log('request has expired');
    });

    req.on('responseTimeout', function (res) {
      console.log('response has expired');

    });

    //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
    req.on('error', function (err) {
      console.log('request error', err);
    });
  })

  //   

}

module.exports.updateRulesOfEngineAcquirer = async function (rule_type) {

  console.log("calling update rule status", rule_type)
  var res = rules.fetchRuleByType(rule_type)
  res.then(function (response) {
    var responseRule = null
    if (response.length > 0) {
      responseRule = response[0].rule
    }
    var args = {
      data: {
        rule_type: rule_type,
        rule: responseRule
      },
      headers: {
        "Content-Type": 'application/json'
      }
    };
    console.log("argssss#######", args)
    var client = new restClient()
    let url = process.env.JAVA_RULE_ENGINE_URL_ACQUIRER + "/renoSecureAcquirer/updateRule";

    var req = client.post(url, args, function (data, response) {

    });
    req.on('requestTimeout', function (req) {
      console.log('request has expired');
    });

    req.on('responseTimeout', function (res) {
      console.log('response has expired');

    });

    //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
    req.on('error', function (err) {
      console.log('request error', err);
    });
  })

  //   

}

module.exports.updateCustomRulesOfEngineAcquirer = async function (rule_name) {

  console.log("calling update rule status", rule_name)
  var res = rules.fetchCustomRuleByName(rule_name)
  res.then(function (response) {
    var responseRule = null
    if (response.length > 0) {
      responseRule = response[0].query
    }
    var args = {
      data: {
        name: rule_name,
        query: responseRule
      },
      headers: {
        "Content-Type": 'application/json'
      }
    };
    console.log("argssss#######", args)
    var client = new restClient()
    let url = process.env.JAVA_RULE_ENGINE_URL_ACQUIRER + "/renoSecureAcquirer/updateCustomRule";

    var req = client.post(url, args, function (data, response) {

    });
    req.on('requestTimeout', function (req) {
      console.log('request has expired');
    });

    req.on('responseTimeout', function (res) {
      console.log('response has expired');

    });

    //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
    req.on('error', function (err) {
      console.log('request error', err);
    });
  })

  //   

}


module.exports.functionalNonFunctionalLive = async function (featureData, finalResponse) {
  console.log("calling update rule status")
  let featureId = featureData.id
  let featureDetails = await accumulators.getAccumulatorById(featureId)
  let queryStructure = featureDetails[0].query_structure
  let featureName = featureDetails[0].pojofieldid
  let sandBoxUrl = process.env.PRODUCTION_HOST_API + "/accumulator/createAccuireAccumulator";

  var args = {
    data: queryStructure,
    headers: {
      "Content-Type": 'application/json'
    }
  };

  var client = new restClient()
  var req = client.post(sandBoxUrl, args, (data, response) => {
    var dataUpdateAccumulator = {
      name: featureName,
      statussandbox: 1
    }
    accumulators.updateAccumulator(dataUpdateAccumulator, finalResponse)
  });

  req.on('requestTimeout', function (req) {
    console.log('request has expired');
  });

  req.on('responseTimeout', function (res) {
    console.log('response has expired');
  });

  req.on('error', function (err) {
    console.log('request error', err);
  });

  // console.log("calling update rule status")
  // var res = rule_type == 'heuristic' ? heuristic.fetchHeuristicRuleByType(rule_type) : rules.fetchRuleByType(rule_type)
  // res.then(function (response) {

  //   console.log("argssss#######", args)
  //   var client = new restClient()
  //   let url = process.env.JAVA_RULE_ENGINE_URL_ACQUIRER + "/renoSecureAcquirer/updateRule";




  //   //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts

  // })

  //   

}

module.exports.createAccuireAccumulator = async (accumulatorReq, sendResponse) => {
  let accumulatorFor = accumulatorReq.accumulatorFor.map((data) => data.item_id)
  let accumulatorFunction = accumulatorReq.accumulatorFunction
  let accumulatorFunctionOf = accumulatorReq.accumulatorFunctionOf
  let whereCondition = accumulatorReq.accumulatorsetArray
  let duration = accumulatorReq.duration
  let primaryOperator = accumulatorReq.operator
  var columns = []
  var durationDetails = await durationObj.getDurationByValue(duration)
  var windowType = durationDetails[0].type
  switch (accumulatorReq.accumulatorFunction) {
    case 'count':
      columns = (windowType == 'duration') ? [{ $count: accumulatorFunctionOf }] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",count)"]
      break;
    case 'sum':
      columns = (windowType == 'duration') ? [{ $sum: accumulatorFunctionOf }] : ["LASTNSUM(" + windowType + "(" + accumulatorFunctionOf + "," + duration + "))"]
      break;
    case 'boolean':
      columns = (windowType == 'duration') ? ["1"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",boolean)"]
      break;
    case 'average':
      columns = (windowType == 'duration') ? [{ $avg: accumulatorFunctionOf }] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",average)"]
      break;
    case 'percentile':
      columns = (windowType == 'duration') ? ["MY_PERCNETILE(" + accumulatorFunctionOf + ")"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",MY_PERCNETILE)"]
      break;
    case 'median':
      columns = (windowType == 'duration') ? ["MY_MEDIAN(" + accumulatorFunctionOf + ")"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",MY_MEDIAN)"]
      break;
    case 'standerd_deviation':
      columns = (windowType == 'duration') ? ["MY_DEVIATION(" + accumulatorFunctionOf + ")"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",MY_DEVIATION)"]
      break;
    case 'topkdistinct':

      break
  }

  columns = accumulatorFor.concat(columns)
  joinCondition = []
  //console.log(columns)
  //console.log("$#$#@$#@#$")
  var queryPool = await createAccuireWhere(whereCondition)

  let joinConditionAll = joinCondition.length > 0 ? "{" + joinCondition.join(",") + "}" : ""


  isDependentWhere = 0

  for (var i = 0; i < accumulatorFor.length; i++) {
    data = await getObjectsByvaluePromis(6, accumulatorFor[i])
    type = data.response[0].type
    if (data.response[0].isdependent == 1) {
      isDependentWhere = data.response[0].isdependent
      break
    }
  }




  if (joinConditionAll != '') {
    var queryJson = {
      $select: {
        $columns: columns,
        $from: 'ISOMESSAGEACCUIREDEV',
        $joins: JSON.parse(joinConditionAll),
        $groupBy: accumulatorFor,
      }
    }
  } else if (isDependentGlobal == 1 || isDependentWhere == 1) {
    var queryJson = {
      $select: {
        $columns: columns,
        $from: 'ISOMESSAGEACCUIREDEV2',
        $groupBy: accumulatorFor,
      }
    }
  } else {
    var queryJson = {
      $select: {
        $columns: columns,
        $from: 'ISOMESSAGEACCUIREDEV',
        $groupBy: accumulatorFor,
      }
    }
  }
  
  //console.log(JSON.stringify(queryJson))
  //console.log(accumulatorFor)




  //console.log("isDependent", isDependentGlobal)
  var query = sqlbuilder.build(queryJson).sql
  var queryArr = query.split("GROUP")
  queryPool = queryPool.filter(Boolean)
  //console.log(queryPool)
  var whereCond = queryPool.length > 0 ? "where " + '(' + queryPool.join(') ' + ruleStructure.sqlOperators[primaryOperator] + ' (') + ')' : ""
  //console.log(whereCond)
  var durationSettings = (windowType == 'duration') ? " WINDOW TUMBLING (" + duration + ") " : ""
  var finalQuery = queryArr[0] + durationSettings + whereCond + " GROUP" + queryArr[1]
  finalQuery = finalQuery.replace(/`/gi, '');

  var operators;
  operators = accumulatorReq.accumulatorFunction == 'boolean' ? "{ \"compare\": {\"compareType\": \"Equal|Not Equal\",\"type\": \"text\" }}"
    : "{ \"compare\": {\"compareType\": \"Equal|Not Equal|Greater Than|Less Than\",\"type\": \"text\" }}"

  //console.log(accumulatorFor)

  if (accumulatorReq.preview) {
    sendResponse({ final_query: finalQuery })
  } else {
    //console.log("finalQuery",finalQuery)
    isDependentGlobal = isDependentGlobal == 1 ? true : true

    //demoProcess.updateAccumulatorOfEngineAcquirer(accumulatorReq.accumulatorname.replace(/ /g, "_"), finalQuery, isDependentGlobal, accumulatorFor)
    isDependentGlobal = 0
    const result = {
      name: accumulatorReq.accumulatorname,
      query: finalQuery,
      field_type: accumulatorReq.accumulatorFunction,
      operators: operators,
      query_structure: JSON.stringify(accumulatorReq),
      description: accumulatorReq.description,
      accumulator_for: "accuire",
      status: 0,
      isvalid: 0
    };

    var dataPojoField = {
      pojoid: 6,
      field: accumulatorReq.accumulatorname.replace(/ /g, "_"),
      dbField: accumulatorReq.accumulatorname.replace(/ /g, "_"),
      type: 'integer',
      locale: accumulatorReq.accumulatorname,
      source: '',
      orderIndex: 1,
      isDependent: 0
    }

    let insertResponse = accumulators.insertAccumulator(result, sendResponse, dataPojoField)

  }
}
module.exports.updateAccumulatorStatus = async (accumulatorReq, sendResponse) => {

  //console.log(accumulatorReq)
  const result = {
    name: accumulatorReq.accumulatorname,
    status: accumulatorReq.status
  };
  accumulators.updateAccumulatorStatus(result, sendResponse)
}

module.exports.updateAccumulatorValidity = async (accumulatorReq, sendResponse) => {
  const result = {
    name: accumulatorReq.name,
    isvalid: accumulatorReq.isValid
  };
  // console.log(result)
  accumulators.updateAccumulatorValidity(result, sendResponse)
}

updateAccumulatorOfEngineAcquirer = function (pojofieldid, content, isDependent = false, accumulatorFor = Array()) {
  var client = new restClient()
  var args = {
    data: {
      featue_name: pojofieldid,
      query: content,
      is_dependent: isDependent,
      group_by: accumulatorFor
    },
    headers: {
      "Content-Type": 'application/json'
    }
  };
  let url = process.env.FEATURE_ENGINE_BASE_URL + "/createfeature";
  var req = client.post(url, args, function (data, response) {
  });
  req.on('requestTimeout', function (req) {
    console.log('request has expired');
  });

  req.on('responseTimeout', function (res) {
    console.log('response has expired');

  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
  req.on('error', function (err) {
    console.log('request error', err);
  });
}

module.exports.updateAccumulator = async (accumulatorReq, sendResponse) => {
  let accumulatorFor = accumulatorReq.accumulatorFor.map((data) => data.item_id)
  let accumulatorFunction = accumulatorReq.accumulatorFunction
  let accumulatorFunctionOf = accumulatorReq.accumulatorFunctionOf
  let whereCondition = accumulatorReq.accumulatorsetArray
  let duration = accumulatorReq.duration
  let primaryOperator = accumulatorReq.operator
  var columns = []
  var durationDetails = await durationObj.getDurationByValue(duration)
  var windowType = durationDetails[0].type
  switch (accumulatorReq.accumulatorFunction) {
    case 'count':
      columns = (windowType == 'duration') ? [{ $count: accumulatorFunctionOf }] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",count)"]
      break;
    case 'sum':
      columns = (windowType == 'duration') ? [{ $sum: accumulatorFunctionOf }] : ["LASTNSUM(" + windowType + "(" + accumulatorFunctionOf + "," + duration + "))"]
      break;
    case 'boolean':
      columns = (windowType == 'duration') ? ["1"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",boolean)"]
      break;
    case 'average':
      columns = (windowType == 'duration') ? [{ $avg: accumulatorFunctionOf }] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",average)"]
      break;
    case 'percentile':
      columns = (windowType == 'duration') ? ["MY_PERCNETILE(" + accumulatorFunctionOf + ")"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",MY_PERCNETILE)"]
      break;
    case 'median':
      columns = (windowType == 'duration') ? ["MY_MEDIAN(" + accumulatorFunctionOf + ")"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",MY_MEDIAN)"]
      break;
    case 'standerd_deviation':
      columns = (windowType == 'duration') ? ["MY_DEVIATION(" + accumulatorFunctionOf + ")"] : [windowType + "(" + accumulatorFunctionOf + "," + duration + ",MY_DEVIATION)"]
      break;
    case 'topkdistinct':

      break
  }

  columns = accumulatorFor.concat(columns)
  joinCondition = []
  var queryPool;
  if (accumulatorReq.accumulator_for == "issuer") {
    queryPool = await createWhere(whereCondition)
  } else {
    queryPool = await createAccuireWhere(whereCondition)
  }
  //console.log(queryPool)
  let joinConditionAll = joinCondition.length > 0 ? "{" + joinCondition.join(",") + "}" : ""
  //console.log(joinConditionAll)
  // ISOMESSAGEACCUIREDEV
  if (accumulatorReq.accumulator_for == "issuer") {
    if (joinConditionAll != '') {
      var queryJson = {
        $select: {
          $columns: columns,
          $from: 'ISOMESSAGEDEV',
          $joins: JSON.parse(joinConditionAll),
          $groupBy: accumulatorFor,
        }
      }
    } else {
      var queryJson = {
        $select: {
          $columns: columns,
          $from: 'ISOMESSAGEDEV',
          $groupBy: accumulatorFor,
        }
      }
    }
  } else {
    if (joinConditionAll != '') {
      var queryJson = {
        $select: {
          $columns: columns,
          $from: 'ISOMESSAGEACCUIREDEV',
          $joins: JSON.parse(joinConditionAll),
          $groupBy: accumulatorFor,
        }
      }
    } else {
      var queryJson = {
        $select: {
          $columns: columns,
          $from: 'ISOMESSAGEACCUIREDEV',
          $groupBy: accumulatorFor,
        }
      }
    }
  }

  var query = sqlbuilder.build(queryJson).sql
  var queryArr = query.split("GROUP")
  queryPool = queryPool.filter(Boolean)
  var whereCond = queryPool.length > 0 ? "where " + '(' + queryPool.join(') ' + ruleStructure.sqlOperators[primaryOperator] + ' (') + ')' : ""
  var durationSettings = (windowType == 'duration') ? " WINDOW TUMBLING (" + duration + ") " : ""
  var finalQuery = queryArr[0] + durationSettings + whereCond + " GROUP" + queryArr[1]
  finalQuery = finalQuery.replace(/`/gi, '');
  //console.log(finalQuery)
  var operators;
  operators = accumulatorReq.accumulatorFunction == 'boolean' ? "{ \"compare\": {\"compareType\": \"Equal|Not Equal\",\"type\": \"text\" }}" :
    "{ \"compare\": {\"compareType\": \"Equal|Not Equal|Greater Than|Less Than\",\"type\": \"text\" }}"
  if (accumulatorReq.preview) {
    sendResponse({
      final_query: finalQuery
    })
  } else {
    if (accumulatorReq.accumulator_for == "issuer") {
      //demoProcess.updateAccumulatorOfEngine(accumulatorReq.accumulatorname, finalQuery)
    } else {
      updateAccumulatorOfEngineAcquirer(accumulatorReq.accumulatorname, finalQuery)
    }
    const result = {
      name: accumulatorReq.accumulatorname,
      query: finalQuery,
      field_type: accumulatorReq.accumulatorFunction,
      operators: operators,
      query_structure: JSON.stringify(accumulatorReq),
      description: accumulatorReq.description,
      status: 0,
      accumulator_for: accumulatorReq.accumulator_for
    };
    //  this.sendToEngine(name,query);
    accumulators.updateAccumulator(result, sendResponse)
  }

}

deleteAccumulatorOfEngineAcquirer = function (requestData) {
  var client = new restClient()
  var args = {
    data: requestData,
    headers: {
      "Content-Type": 'application/json'
    }
  };
  let url = process.env.FEATURE_ENGINE_BASE_URL + "/deletefeature";
  var req = client.post(url, args, function (data, response) {
  });
  req.on('requestTimeout', function (req) {
    console.log('request has expired');
  });

  req.on('responseTimeout', function (res) {
    console.log('response has expired');

  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
  req.on('error', function (err) {
    console.log('request error', err);
  });
}


module.exports.updateFunctionalNonFunctionalAccumulator = async (accumulatorReq, sendResponse) => {
  const result = {
    status: accumulatorReq.status,
    deleted_date: accumulatorReq.lastDeleteDate || '',
    id: accumulatorReq.id
  };
  var featureStatus = true

  if (result.status == 0) {
    // Collect all active heuristic
    let allActiveHeuristic = await heuristicModel.getActiveHeuristics('accuire');
    await Promise.all(allActiveHeuristic.map(async (heuristicRule) => {
      let ruleStructureObj = JSON.parse(heuristicRule.structure)
      var ruleElements = ruleStructureObj.rulesetArray[0].element

      ruleStructureObj.rulesetArray[0].element = await Promise.all(ruleElements.map(async (element, key) => {
        if (element.ruleOn == 'custom' && featureStatus) {
          // Get the reference field Info
          let transactionField = element.transactionField
          let fieldDetails = await rulesetObj.getTransactionFieldDetails(transactionField)
          let featurerefid = fieldDetails[0].featurerefid
          featureStatus = (result.id == featurerefid) ? false : true
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


  if (accumulatorReq.status == 2) {
    let reqJson = {
      "featue_name": accumulatorReq.name.replace(/ /g, "_"),
      "is_stream": false
    }
    deleteAccumulatorOfEngineAcquirer(reqJson)
  }
  if (accumulatorReq.status == 1 && accumulatorReq.type == 'functional') {
    accumulators.getAccumulatorById(accumulatorReq.id).then((res) => {
      //console.log(res)


      //let finalQuery = "create table " + res[0].pojofieldid.replace(/ /g, "_") + " AS " + res[0].content;
      let finalQuery = res[0].content;
      let accumulatorFor = Array(JSON.parse(res[0].query_structure).accumulatorFor[0].item_id)

      var accumulatorForArr = JSON.parse(res[0].query_structure).accumulatorFor.map((accmulator) => accmulator.item_id)
      updateAccumulatorOfEngineAcquirer(res[0].pojofieldid.replace(/ /g, "_"), finalQuery, true, accumulatorForArr)
    })

  }

  switch (accumulatorReq.type) {
    case 'functional':
      if (featureStatus) {
        accumulators.updateStatusAccumulator(result, sendResponse)
      }
      break;
    default:
      features.updateStatusFeature(result, sendResponse)
  }

}

module.exports.getAccumulator = (status, sendResponse) => {
  return accumulators.getAccumulator(status).then(sendResponse)
}