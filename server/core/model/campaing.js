module.exports.fetchCampaing = function () {
  return global.db
    .select('*')
    .from('vicidial_campaigns')
}
module.exports.fetchActiveCampaing = function () {
  return global.db
    .select('*').count('vicidial_users.user_id as count')
    .from('vicidial_campaigns').join('vicidial_users', 'vicidial_campaigns.user_group', 'vicidial_users.user_group').where('vicidial_campaigns.active','Y').where('vicidial_users.active','Y').groupBy('vicidial_campaigns.user_group')
}
module.exports.updateSurvey = function (data, response) {
  console.log(data,"########################");
  var request={
    survey_first_audio_file: data.survey_first_audio_file,
    survey_dtmf_digits: data.survey_dtmf_digits,
    survey_ni_digit: data.survey_ni_digit,
    survey_wait_sec: data.survey_wait_sec,
    survey_opt_in_audio_file: data.survey_opt_in_audio_file,
    survey_ni_audio_file: data.survey_ni_audio_file,
    survey_method: data.survey_method,
    survey_no_response_action: data.survey_no_response_action,
    survey_ni_status: data.survey_ni_status,
    survey_third_digit: data.survey_third_digit,
    survey_third_audio_file: data.survey_third_audio_file,
    survey_third_status: data.survey_third_status,
    survey_third_exten: data.survey_third_exten,
    survey_fourth_digit: data.survey_fourth_digit,
    survey_fourth_audio_file: data.survey_fourth_audio_file,
    survey_fourth_status: data.survey_fourth_status,
    survey_fourth_exten: data.survey_fourth_exten,
    survey_response_digit_map: data.survey_response_digit_map,
    survey_xfer_exten:data.survey_xfer_exten,
    survey_camp_record_dir: data.survey_camp_record_dir,
    voicemail_ext: data.voicemail_ext,
    survey_menu_id: data.survey_menu_id,
    survey_recording: data.survey_recording
  }
  return global.db.table('vicidial_campaigns')
    .where({
      campaign_id: data.campaign_id
    })
    .update(request)
    .returning('*')
    .bind(console)
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