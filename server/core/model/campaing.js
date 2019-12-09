module.exports.fetchCampaing = function () {
  return global.db
    .select('*')
    .from('campaing').orderBy('id', 'desc')
}

module.exports.createCampaing = function (data, response) {
  return global.db('campaing')
    .insert(data)
    .returning('id')
    .then((res) => {
      response({
        status: true
      })
    })
    .catch((error) => {
      console.log(error);
      response({
        "error": error.sqlMessage
      })
    });

}

module.exports.updateCampaing = function (data, response) {

  return global.db.table('campaing')
    .where({
      id: data.id
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
}

module.exports.deleteCampaing = (id,response) => {

  return global.db('campaing').where('id', id)
  .del().then(() => {
    response({
      status: true
    })
  })
  .catch(console.error);
}