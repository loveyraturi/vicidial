module.exports.fetchUsers = function () {
  return global.db
    .select('*')
    .from('vicidial_users').orderBy('user_id', 'desc')
}
module.exports.fetchUsersById = function (id) {
  return global.db
    .select('*')
    .from('vicidial_users').where({
      user_id: id
    })
}
module.exports.fetchGroupsByUser = function (user_group) {
  return global.db
    .select('*')
    .from('vicidial_user_groups').where({
      user_group: user_group
    })
}

module.exports.fetchGroups = function () {
  return global.db
    .select('*')
    .from('vicidial_user_groups')
}
module.exports.fetchReportData = function (limitgot,offsetgot) {
  var limit=parseInt(limitgot, 10);
  var offset=parseInt(offsetgot, 10);
  console.log(limit,offset)
  if(limit==0 && offset==0){
    return global.db
    .select('*')
    .from('vicidial_log')
  }else{
  return global.db
    .select('*')
    .from('vicidial_log').limit(limit).offset(offset)
  }
}

module.exports.fetchCountOfReport = function () {
  return global.db
    .count('*', {as: 'count'})
    .from('vicidial_log')
}
module.exports.fetchCountReportDataBetween = function (data) {
  console.log(data)
  if(data.limit==0 && data.offset==0){
    return global.db
    .count('*', {as: 'count'})
    .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom,data.dateto]).whereIn('campaign_id',data.campaingId).orWhereIn('user',data.userId)
  }else{
  return global.db
    .count('*', {as: 'count'})
    .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom,data.dateto]).whereIn('campaign_id',data.campaingId).orWhereIn('user',data.userId).limit(data.limit).offset(data.offset)
  }
}
module.exports.fetchReportDataBetween = function (data) {
  console.log(data)
  if(data.limit==0 && data.offset==0){
    return global.db
    .select('lead_id','list_id','campaign_id',
    'call_date',
    'start_epoch',
    'end_epoch',
    'length_in_sec',
    'status',
    'phone_number',
    'user',
    'comments',
    'processed',
    'term_reason')
    .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom,data.dateto]).whereIn('campaign_id',data.campaingId).orWhereIn('user',data.userId)
  }else{
  return global.db
    .select('lead_id','list_id','campaign_id',
    'call_date',
    'start_epoch',
    'end_epoch',
    'length_in_sec',
    'status',
    'phone_number',
    'user',
    'comments',
    'processed',
    'term_reason')
    .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom,data.dateto]).whereIn('campaign_id',data.campaingId).orWhereIn('user',data.userId).limit(data.limit).offset(data.offset)
  }
}
module.exports.fetchGroupsById = function (id) {
  return global.db
    .select('*')
    .from('vicidial_user_groups').where({user_group:id})
}
module.exports.fetchUserBYCampaingId = function (id) {
  return global.db.select('*').from('vicidial_live_agents').where({campaign_id:id})
}
module.exports.authenticate = function (data) {
  console.log(data)
  return global.db
    .select('*')
    .from('vicidial_users').where({
      user: data.userName,
      pass: data.password
    })

}


module.exports.createUser = function (data, response) {
  var userdetails = {
    user: data.name,
    pass: data.password,
    full_name: data.name,
    user_level: data.level,
    user_group:data.group,
    phone_login: data.phonenumber,
    phone_pass: data.password,
    active: data.status
  }
  return global.db('vicidial_users')
    .insert(userdetails)
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

module.exports.updateUserStatus = function (data, response) {
  var userdetailsstatus = {
    active: data.active
  }
  console.log(userdetailsstatus)
  return global.db.table('vicidial_users')
  .where({
    user_id: data.user_id
  })
  .update(userdetailsstatus)
  .then(() => {
    response({
      status: true
    })
  })
  .catch(console.error);
}

module.exports.updateUser = function (data, response) {
  var userdetails = {
    user: data.name,
    pass: data.password,
    full_name: data.name,
    user_level: data.level,
    user_group:data.group,
    phone_login: data.phonenumber,
    phone_pass: data.password,
    active: data.status
  }

  return global.db.table('vicidial_users')
    .where({
      user_id: data.id
    })
    .update(userdetails)
    .returning('*')
    .bind(console)
    .then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);
}

module.exports.updateGroup = function (data, response) {
  var groupDetails = {
    group_name: data.groupName,
    allowed_campaigns: data.allowed_campaigns
  }

  return global.db.table('vicidial_user_groups')
    .where({
      user_group: data.name,
    })
    .update(groupDetails)
    .returning('*')
    .bind(console)
    .then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);
}

module.exports.deleteUser = (id, response) => {

  return global.db('vicidial_users').where('user_id', id)
    .del().then(() => {
          response({
            status: true
          })
    }).catch(console.error);

}