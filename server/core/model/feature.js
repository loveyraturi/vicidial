var { schemaValidator, userSchema } = require('../config/schema')
const ruleset = require('./ruleset')
var bcrypt = require('bcryptjs');

module.exports.findFeatureType = function () {
  
  return global.db.column([
    {id: 'id'},
    {name: 'name'},
    {canExtend: 'can_extend'}
  ])
  .select()
  .from('feature_type').as('feature_type')
  .orderBy('id', 'desc')
}
module.exports.findFeatureList = function () {
  return global.db.column([
    {id: 'id'},
    {name: 'name'},
    {configuration: 'configuration'},
    {ksqlquery: 'ksqlquery'},
    {name_ksql: 'name_ksql'},
    {featuretype: 'featuretype'}
  ])
  .select()
  .from('feature').as('feature')
  .orderBy('id', 'desc')
}
module.exports.findActiveFeatureList = function (status) {
  return global.db.column([
    {configuration: 'configuration'},
    {featue_name: 'name_ksql'}
  ])
  .select()
  .from('feature').as('feature')
  .where({ status: status })
  .orderBy('id', 'desc')
}
module.exports.findFeatureTypeDetails = function (featuretypeid=0) {
  
  return global.db.column([
    {configuration: 'configuration'}
  ])
  .select()
  .from('feature_master').as('feature_master')
  .where({ featuretypeid: featuretypeid })
}

module.exports.getFeatureDetails = function (featuretypeId="") {
  
  return global.db.column([
    {configuration: 'configuration'},
    {ksqlquery: 'ksqlquery'},
    {name_ksql: 'name_ksql'}
  ])
  .select()
  .from('feature').as('feature')
  .where({ id: featuretypeId })
}

module.exports.updateFeatureDetails = function (featuretypeId, updateData, response) {
  global.db('feature')
  .where('id','=',featuretypeId)
  .update(updateData)
  .then(( res, err) => {
    if (err) {
      response(500, {"error": "Error Occured"})
    }
    else{
      response(200, { status: true })
    }
  })
}


module.exports.updateStatusFeature = function (data, response) {
  const dataToSet = {
    status: data.status
  }
  if(data.status == 2) {
    dataToSet.deleted_date = data.deleted_date
  }
  console.log(dataToSet)
  global.db.table('feature')
    .where({
      id: data.id
    })
    .update(dataToSet)
    .returning('*')
    .bind(console)
    .then((res) => {
      
      let where = {
        featurerefid: data.id,
        featuretype: 'non-functional'
      }
      let status = data.status == 1 ? 1:0
      ruleset.updateTransactionFieldDetails(where, status)

      response({
        status: true
      })
    })
    .catch(console.error);
}

module.exports.insertFeatureInfo = (data, response) => {
  var dataObj = JSON.parse(data.configuration)
  
  global.db('feature')
    .insert(data)
    .returning('*')
    .then((res) => {
      // Insert to drlPojo
      var drlPojoData = {
        "pojoid": 6,
        "field": dataObj[0].index,
        "dbfield": dataObj[0].index,
        "type": 'string',
        "locale": data.name,
        "source": "/feature/getFeatureDetails/6",
        "orderIndex": 3,
        "isdependent": 1,
        "active": 0,
        "featuretype": "non-functional",
        "featurerefid": res[0]
      }

      global.db('drl_pojofield')
        .insert(drlPojoData)
        .returning('*')
        .then((res1)=>{
          var drlPojoFldDef = {
            "pojofieldid": res1[0],
            "defination": '{"compare":{"compareType":"Equal|Not Equal","type":"dropdown"}}'
          }
          global.db('drl_pojofield_def')
          .insert(drlPojoFldDef)
          .returning('*')
          .then((res2)={
          })
          response('200', {status:true})
        })


      
    })
    .catch(console.error);
}

module.exports.getDataSettings = function () {
  return global.db.column(['*'])
    .select()
    .from('data_settings').as('data_settings')
    .orderBy('id', 'asc')
}

module.exports.insertDataSettingTemplate = function (dataSettingTemplate) {


  return global.db('data_setting_template')
    .insert(dataSettingTemplate)
    .returning('*')

}


module.exports.insertFeatureInfoCustom = function (featurePojoData, featureDefination) {
  let featureData = {
    'type': 'pojofld',
    'name': featurePojoData.locale,
    'status': 0,
    'configuration': '[{"value":"","typetxt":"","index":""}]',
    'featuretype': 2
  }

  global.db('feature')
    .insert(featureData)
    .returning('*')
    .then((res2) => {
      featurePojoData.featurerefid = res2[0]
      global.db('drl_pojofield')
        .insert(featurePojoData)
        .returning('*')
        .then((res) => {
          let pojofieldid = res[0]
          featureDefination.pojofieldid = pojofieldid
          global.db('drl_pojofield_def')
            .insert(featureDefination)
            .returning('*')
            .then((res1) => {
            })
        })
        .catch(console.error);
    })
}