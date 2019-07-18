var heuristicModel = require('./heuristic')

module.exports.fetchAllMl = function () {
  return global.db.select('*')
    .from('macinelearning')
}
module.exports.fetchAllMlFilter = function (status) {
  return global.db.select('*')
    .where({
      status: status
    })
    .from('macinelearning')
}
module.exports.fetchAllModelDefination = function (status) {
  return global.db.select('*')
    .from('model_definations')
}
module.exports.getModelByName = function (name) {
  return global.db.select('*')
    .where({
      name: name
    })
    .from('macinelearning')
}
module.exports.getModelById = function (modelId) {
  return global.db.select('*')
    .where({
      id: modelId
    })
    .from('macinelearning')
}
module.exports.updateModel = function (data, id, sendResponse, key, length) {
  global.db('macinelearning')
    .update(data)
    .where({
      id: id
    })
    .then(() => {
      if (key == (length - 1)) {
        console.log("Finished sync")
        sendResponse({
          status: "completed"
        })
      }
    })
}
module.exports.clearMLInfo = () => {
  return new Promise((resolve) => {
    global.db('macinelearning')
      .del()
      .then((res) => {
        global.db('heuristic_field')
          .where('fieldtype', 'ml')
          .del()
          .then((res) => {
            resolve({status: true})
          })
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
module.exports.insertModel = function (data, heuristicModelSchema, sendResponse, key, length) {
  global.db('macinelearning')
    .insert(data)
    .returning('*')
    .bind(console)
    .then((res) => {
      heuristicModelSchema.ref_id = res[0]
      heuristicModel.insertHeuristicMLFld(heuristicModelSchema)
      if (key == (length - 1)) {
        sendResponse({
          status: "completed"
        })
      }
    })
    .catch(console.error);
}
module.exports.insertModelCustom = function (data, heuristicModelSchema, sendResponse, key, length) {
  global.db('macinelearning')
    .insert(data)
    .returning('*')
    .bind(console)
    .then((res) => {
      heuristicModelSchema.ref_id = res[0]
      heuristicModelSchema.type == 'integer'? heuristicModel.insertHeuristicMLFld(heuristicModelSchema):heuristicModel.insertHeuristicMLFldCustom(heuristicModelSchema)
      if (key == (length - 1)) {
        sendResponse({
          status: "completed"
        })
      }
    })
    .catch(console.error);
}
module.exports.updateMlFiltered = function (data, response) {
  global.db('macinelearning')
    .update(data)
    .where({ name: data.name })
    .then(function () {
      let heuristicModelSchema = {
        field: data.name,
        active: data.status
      }
      heuristicModel.updateHeuristicFldMl(heuristicModelSchema)
      response({ status: true })
    })
    .catch(function (error) {
      console.log(error)
      response({ status: false })
    })
}