module.exports.fetchCampaing = function () {
  return global.db
    .select('*')
    .from('vicidial_campaigns')
}

module.exports.createCampaing = function (data, response) {
  console.log("@$@$@#$@#$@$", data.campaign)
  return global.db('vicidial_campaigns')
    .insert(data.campaign)
    .then((res) => {
      console.log("#############", data.group.user_group)
      if (data.group.user_group != undefined) {
        if (data.group.user_group != "" && data.group.group_name != "" && data.group.allowed_campaigns != "") {
          console.log("################NOT INSIDE#################")
          global.db('vicidial_user_groups')
            .insert(data.group)
            .then((resp) => {

            }).catch((error) => {
              console.log(error);
              response({
                "error": error.sqlMessage
              })
            })
        }
      }
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
  console.log(data.campaign)
  return global.db.table('vicidial_campaigns')
    .where({
      campaign_id: data.campaign.campaign_id
    })
    .update(data.campaign)
    .returning('*')
    .bind(console)
    .then((resp) => {
      console.log(resp)
      global.db
        .select('allowed_campaigns')
        .from('vicidial_user_groups').where({
          user_group: data.campaign.user_group
        }).then((respo) => {
          if (respo.length != 0) {
            console.log("NF", respo[0])
            if (respo[0].allowed_campaigns.includes("-ALL-CAMPAIGNS-")) {
              console.log("$%######################################$#4")
              var groupinfo = {
                allowed_campaigns: "-ALL-CAMPAIGNS-"
              }
            } else {
              var groupinfo = {
                allowed_campaigns: respo[0].allowed_campaigns + " " + data.campaign.campaign_id
              }
            }
            global.db.table('vicidial_user_groups')
              .where({
                user_group: data.campaign.user_group
              })
              .update(groupinfo)
              .then((respn) => {

              }).catch((error) => {
                console.log(error);
                response({
                  "error": error.sqlMessage
                })
              })
          }
          // if(respo.siz){
          //   console.log("undefined######")
          // }else{
          //   console.log(respo[0].allowed_campaigns,"######")
          // }




        })

      response({
        status: true
      })
    })
    .catch(console.error);
}
module.exports.fetchCampaingById = (id) => {

  return global.db
    .select('*')
    .from('vicidial_campaigns').where({
      campaign_id: id
    })
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
module.exports.deleteCampaing = (id, response) => {

  return global.db('vicidial_campaigns').where('campaign_id', id)
    .del().then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);
}