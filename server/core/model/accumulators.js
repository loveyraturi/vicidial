const ruleset = require('./ruleset')
module.exports.getAccumulatorList = function () {
  //
  //console.log(global.db)

  return global.db.column([{
    pojofieldid: 'name'
  },
  {
    locale: 'name'
  },
  {
    content: 'query'
  },
  {
    fieldType: 'field_type'
  },
  {
    defination: 'operators'
  },
    'description',
    'status',
    'accumulator_for'
  ])
    .select()
    .from('accumulators').as('accumulators')
    .where({
      status: 1
    }).orderBy('id', 'desc')
}

module.exports.getAccumulatorListByType = function (accumulator_for) {
  return global.db.column([{
    pojofieldid: 'name'
  },
  {
    locale: 'name'
  },
  {
    content: 'query'
  },
  {
    fieldType: 'field_type'
  },
  {
    defination: 'operators'
  },
    'description',
    'status',
    'accumulator_for',
    'isvalid'
  ])
    .select()
    .from('accumulators').as('accumulators')
    .where({
      status: 1,
      accumulator_for: accumulator_for
    }).orderBy('id', 'desc')
}

module.exports.getAccumulatorListByTypev1 = function (accumulator_for) {
  return global.db.column([{
    pojofieldid: 'name'
  },
  {
    locale: 'name'
  },
  {
    content: 'query'
  },
  {
    query_structure: 'query_structure'
  },
  {
    fieldType: 'field_type'
  },
  {
    defination: 'operators'
  },
    'description',
    'status',
    'accumulator_for',
    'isvalid'
  ])
    .select()
    .from('accumulators').as('accumulators')
    .where({
      status: 1,
      accumulator_for: accumulator_for
    }).orderBy('id', 'desc')
}

module.exports.getInactiveAccumulatorListByType = function (accumulator_for) {
  return global.db.column([{
    pojofieldid: 'name'
  },
  {
    locale: 'name'
  },
  {
    content: 'query'
  },
  {
    fieldType: 'field_type'
  },
  {
    defination: 'operators'
  },
    'description',
    'status',
    'accumulator_for',
    'isvalid'
  ])
    .select()
    .from('accumulators').as('accumulators')
    .where({
      status: 0,
      accumulator_for: accumulator_for
    }).orderBy('id', 'desc')
  //return global.db.select(['description,status,accumulator_for,isvalid']).from('accumulators accumulators').where({status: 0,accumulator_for:accumulator_for}).order_by('id', 'desc')
}

module.exports.getAccumulatorByName = function (name) {
  return global.db.select('name as pojofieldid', 'name as locale', 'query as content', 'field_type as fieldType', 'operators as defination', 'description', 'status', 'accumulator_for').from('accumulators').where({
    status: 1,
    name: name
  }).orderBy('id', 'desc')
}

module.exports.getAccumulatorById = function (id) {
  return global.db.select(
    'name as pojofieldid',
    'name as locale',
    'query as content',
    'field_type as fieldType',
    'query_structure as query_structure',
    'operators as defination',
    'description',
    'status',
    'accumulator_for'
  ).from('accumulators').where({
    id: id
  }).orderBy('id', 'desc')
}

module.exports.getInactiveAccumulatorList = function () {

  return global.db.column([{
    pojofieldid: 'name'
  },
  {
    locale: 'name'
  },
  {
    content: 'query'
  },
  {
    fieldType: 'field_type'
  },
  {
    defination: 'operators'
  },
    'description',
    'status'
  ])
    .select()
    .from('accumulators').as('accumulators')
    .where({
      status: 0
    }).orderBy('id', 'desc')



  //return global.db.select(['name pojofieldid, name locale,query content,field_type fieldType,operators defination,description,status']).from('accumulators accumulators').where({status: 0}).order_by('id', 'desc')
}

module.exports.getCountOfActiveAccumulator = function (accumulator_for) {

  return global.db('accumulators').count({
    countAccumulator: ['name']
  }).where({
    status: 1,
    accumulator_for: accumulator_for
  })


  //return global.db.select(['count(name) countAccumulator']).from('accumulators accumulators').where({status: 1,accumulator_for:accumulator_for})
}

module.exports.getCountOfAllAccumulator = function (accumulator_for) {

  return global.db('accumulators').count({
    countAccumulator: ['name']
  }).where({
    accumulator_for: accumulator_for
  })
  //return global.db.select(['count(name) countAccumulator']).from('accumulators accumulators').where({accumulator_for:accumulator_for})
}

module.exports.getCountOfInactiveAccumulator = function (accumulator_for) {

  return global.db('accumulators').count({
    countAccumulator: ['name']
  }).where({
    status: 0,
    accumulator_for: accumulator_for
  })


  //return global.db.select(['count(name) countAccumulator']).from('accumulators accumulators').where({status: 0,accumulator_for:accumulator_for})
}
module.exports.getAccumulatorByValue = function (value) {
  return global.db.column([{
    pojofieldid: 'name'
  },
  {
    locale: 'name'
  },
  {
    content: 'query'
  },
  {
    fieldType: 'field_type'
  },
  {
    defination: 'operators'
  },
    'description',
  {
    structure: 'query_structure'
  },
    'accumulator_for'
  ])
    .select()
    .from('accumulators').as('accumulators')
    .where({
      name: value
    })



  //return global.db.select(['description, query_structure structure,accumulator_for']).from('accumulators accumulators').where({ name: value })
}

module.exports.insertAccumulator = function (data, response, dataPojoField) {
  console.log("1")
  return global.db('accumulators')
    .insert(data)
    .returning('id')
    .then((res) => {
      response({
        status: true
      })
      dataPojoField.featurerefid = res[0]
      dataPojoField.featuretype = 'functional'
      this.insertPojoField(dataPojoField)

    })
    .catch((error)=>{
      console.log(error);
      response({"error":error.sqlMessage})
    });

  /*
    global.db.insert('accumulators', data, (err, res) => {
      if (err) { 
        return console.error("error: " + err.msg);
    }
      response({status:true})
    });
  */
}


module.exports.insertPojoField = function (data) {

  global.db('drl_pojofield')
    .insert(data)
    .returning('*')
    .bind(console)
    .then((res) => {
      let fieldId = res[0]
      let data1 = {
        "pojofieldid": fieldId,
        "defination": '{"compare": {"compareType": "Equal|Not Equal|Greater Than|Less Than","type": "text"}}'
      }

      global.db('drl_pojofield_def')
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


module.exports.updateAccumulator = function (data, response) {
  console.log(data)
  let sql = global.db.table('accumulators')
  .where({
    name: data.name
  }).update(data).toString();

  global.db.table('accumulators')
    .where({
      name: data.name
    })
    .update(data)
    .returning('*')
    .bind(console)
    .then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);



  /*
    global.db.update('accumulators', data, {name: data.name}, (err, res) => {
     if (err){ 
      return console.error("error: " + err.msg);
    }
     response({status:true})
    });*/
}

module.exports.updateAccumulatorStatus = function (data, response) {

  global.db.table('accumulators')
    .where({
      name: data.name
    })
    .update(data)
    .returning('*')
    .bind(console)
    .then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);

  /*global.db.update('accumulators', data, {name: data.name}, (err, res) => {
   if (err) return console.error("error: " + err.msg);
   response({status:true})
  });*/
}
module.exports.updateAccumulatorValidity = function (data, response) {
  global.db.table('accumulators')
    .where({
      name: data.name
    })
    .update(data)
    .returning('*')
    .bind(console)
    .then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);

  /*global.db.update('accumulators', data, {name: data.name}, (err, res) => {
   if (err) return console.error("error: " + err.msg);
   response({status:true})
  });*/
}

module.exports.updateStatusAccumulator = function (data, response) {
  const dataToSet = {
    status: data.status
  }
  if (data.status == 2) {
    dataToSet.deleted_date = data.deleted_date
  }
  console.log(dataToSet)
  global.db.table('accumulators')
    .where({
      id: data.id
    })
    .update(dataToSet)
    .returning('*')
    .bind(console)
    .then((res) => {
      let where = {
        featurerefid: data.id,
        featuretype: 'functional'
      }
      let status = data.status == 1 ? 1 : 0
      ruleset.updateTransactionFieldDetails(where, status)
      response({
        status: true
      })
    })
    .catch(console.error);
}


module.exports.getAccumulator = (status) => {
  
  console.log("inside accumulators testing")
return global.db.select(
    'name',
    'status',
    'id',
    'deleted_date',
    'isValid as isvalid',
    global.db.raw('? as type', ['functional']),
    'description',
    'statussandbox'
  ).from('accumulators').where({
    status: status,
  })
  
}
  // console.log('query',global.db.select(
  //   'name',
  //   'status',
  //   'id',
  //   'deleted_date',
  //   'isValid as isvalid',
  //   global.db.raw('? as type', ['functional']),
  //   'description',
  //   'statussandbox'
  // ).from('accumulators').where({
  //   status: status
  // }).union(function () {
  //   this.select(
  //     'name',
  //     'status',
  //     'id',
  //     'deleted_date',
  //     global.db.raw('? as isvalid', [1]),
  //     global.db.raw('? as type', ['non-functional']),
  //     global.db.raw('? as description', ['']),
  //     'statussandbox'
  //   ).from('feature').where({
  //     status: status
  //   })
  // }).toString())



module.exports.getAccumulatorNonFunctional = (status) => {
  
 return global.db.select(
  'name',
  'status',
  'id',
  'deleted_date',
  global.db.raw('? as isvalid', [1]),
  global.db.raw('? as type', ['non-functional']),
  global.db.raw('? as description', ['']),
  'statussandbox'
).from('feature').where({
  status: status,
})
}
  