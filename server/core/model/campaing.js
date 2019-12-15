module.exports.fetchCampaing = function () {
  return global.db
    .select('*')
    .from('vicidial_campaigns')
}

module.exports.createCampaing = function (data, response) {

  return global.db('vicidial_campaigns')
    .insert(data.campaign)
    .returning('campaign_id')
    .then((res) => {
      global.db('vicidial_user_groups')
    .insert(data.group)
    .then((resp) => {
      response({
        status: true
      })
    }).catch((error) => {
      console.log(error);
      response({
        "error": error.sqlMessage
      })
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

  return global.db.table('vicidial_campaigns')
    .where({
      campaing_id: data.id
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
module.exports.fetchCampaingById = (id) => {

  return global.db
  .select('*')
  .from('vicidial_campaigns').where({campaign_id:id})
}

module.exports.updateCampaingStatus = function (data, response) {
  var campaingdetailsstatus = {
    active: data.active
  }
  console.log(campaingdetailsstatus)
  return global.db.table('vicidial_campaigns')
  .where({
    campaign_id: data.campaign_id
  })
  .update(campaingdetailsstatus)
  .then(() => {
    response({
      status: true
    })
  })
  .catch(console.error);
}
module.exports.deleteCampaing = (id,response) => {

  return global.db('vicidial_campaigns').where('campaign_id', id)
  .del().then(() => {
    response({
      status: true
    })
  })
  .catch(console.error);
}