module.exports.structure = `
    rule "%rulename%"
    lock-on-active
    when
    %ruleConf%
    $response:ResponseFromRules();
    then
    modify($response){
        setRulesResponse("%rulename%", "%response%");
    } 
end`

module.exports.structureH = `
    rule "%rulename%"
    lock-on-active
    when
    %ruleConf%
    $response:ResponseFromRules();
    then
    modify($response){
        setRulesResponseH("%rulename%", "%response%");
    } 
end`

var velocityCondition = Array();
velocityCondition['Equal'] = '$isoCounter.getCounter(\'%pojoField%\',$requestIso)  ==  %compareWith%'
velocityCondition['Not Equal'] = '  $isoCounter.getCounter(\'%pojoField%\',$requestIso) !=  %compareWith%'
velocityCondition['Greater Than'] = ' $isoCounter.getCounter(\'%pojoField%\',$requestIso)  >  %compareWith%'
velocityCondition['Less Than'] = '  $isoCounter.getCounter(\'%pojoField%\',$requestIso)  <  %compareWith%'
velocityCondition['greaterThanEqual'] = '  $isoCounter.getCounter(\'%pojoField%\',$requestIso) >=  %compareWith%'
velocityCondition['lessThanEqual'] = ' $isoCounter.getCounter(\'%pojoField%\',$requestIso)  <=  %compareWith%'

var allCondition = Array();
allCondition['In'] = 'this["%pojoField%"] in ( %compareWith% )'
allCondition['Not in'] = 'this["%pojoField%"] not in ( %compareWith% )'
allCondition['Equal'] = 'this["%pojoField%"]  ==  %compareWith%'
allCondition['Not Equal'] = 'this["%pojoField%"]  !=  %compareWith%'
allCondition['Greater Than'] = 'this["%pojoField%"]  >  %compareWith%'
allCondition['Less Than'] = 'this["%pojoField%"]  <  %compareWith%'
allCondition['greaterThanEqual'] = 'this["%pojoField%"] >=  %compareWith%'
allCondition['lessThanEqual'] = 'this["%pojoField%"]  <=  %compareWith%'

var allConditionForFeature = Array();
allConditionForFeature['Equal'] = 'this["%pojoField%"]  ==  (%devider%)*this["%compareWith%"]'
allConditionForFeature['Not Equal'] = 'this["%pojoField%"]  !=  (%devider%)*this["%compareWith%"]'
allConditionForFeature['Greater Than'] = 'this["%pojoField%"]  >  (%devider%)*this["%compareWith%"]'
allConditionForFeature['Less Than'] = 'this["%pojoField%"]  <  (%devider%)*this["%compareWith%"]'
allConditionForFeature['greaterThanEqual'] = 'this["%pojoField%"] >=  (%devider%)*this["%compareWith%"]'
allConditionForFeature['lessThanEqual'] = 'this["%pojoField%"]  <=  (%devider%)*this["%compareWith%"]'
allConditionForFeature['In'] = 'this["%pojoField%"] in ( %compareWith% )'
allConditionForFeature['Not in'] = 'this["%pojoField%"] not in ( %compareWith% )'

var allConditionForFeatureString = Array();
allConditionForFeatureString['Equal'] = 'this["%pojoField%"]  ==  this["%compareWith%"]'
allConditionForFeatureString['Not Equal'] = 'this["%pojoField%"]  !=  this["%compareWith%"]'
allConditionForFeatureString['In'] = 'this["%pojoField%"] in ( %compareWith% )'
allConditionForFeatureString['Not in'] = 'this["%pojoField%"] not in ( %compareWith% )'



var sqlAllCondition = Array();
sqlAllCondition['Equal'] = "field = 'value'"
sqlAllCondition['Not Equal'] = "field != 'value'"
sqlAllCondition['Greater Than'] = "field > value"
sqlAllCondition['Less Than'] = "field < value"
sqlAllCondition['greaterThanEqual'] = "field >= value"
sqlAllCondition['lessThanEqual'] = "field <= value"

var sqlOperators = Array();
sqlOperators['&&'] = 'and'
sqlOperators['||'] = 'or'

module.exports.velocityCondition = velocityCondition;
module.exports.allCondition = allCondition;
module.exports.sqlAllCondition = sqlAllCondition;
module.exports.sqlOperators = sqlOperators;
module.exports.allConditionForFeature = allConditionForFeature
module.exports.allConditionForFeatureString = allConditionForFeatureString