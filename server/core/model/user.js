const Excel = require('exceljs');

const exportFolder = process.env.EXCELDOWNLOADURL;
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
module.exports.fetchReportData = function (limitgot, offsetgot) {
  var limit = parseInt(limitgot, 10);
  var offset = parseInt(offsetgot, 10);

  return global.db
    .select('*')
    .from('vicidial_log').limit(limit).offset(offset)
}


module.exports.createExcel = function (data,response) {

  var workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet("MIC Report");

  try {

    worksheet.columns = [
      { header: 'uniqueid', key: 'uniqueid', width: 50 },
      { header: 'lead_id', key: 'lead_id', width: 50 },
      { header: 'list_id', key: 'list_id', width: 50 },
      { header: 'campaign_id', key: 'campaign_id', width: 50 },
      { header: 'call_date', key: 'call_date', width: 50 },
      { header: 'length_in_sec', key: 'length_in_sec', width: 50 },
      { header: 'status', key: 'status', width: 50 },
      { header: 'phone_number', key: 'phone_number', width: 50 },
      { header: 'user', key: 'user', width: 50 },
      { header: 'comments', key: 'comments', width: 50 },
      { header: 'processed', key: 'processed', width: 50 },
      { header: 'term_reason', key: 'term_reason', width: 50 },
    ];
    var stream
    if(data.campaingId.length==0){
      stream = global.db
      .select('*')
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).orWhereIn('user', data.userId).stream();

    }else if(data.userId.length==0){
      stream = global.db
      .select('*')
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).whereIn('campaign_id', data.campaingId).stream();

    } else if(data.userId.length==0 && data.campaingId.length==0){
      stream = global.db
      .select('*')
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).stream();

    }
    else{
      stream = global.db
      .select('*')
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).whereIn('campaign_id', data.campaingId).orWhereIn('user', data.userId).stream();

    }
    
     
    stream.on('data', function (d) {
      var obj = {
        uniqueid: d.uniqueid,
        lead_id: d.lead_id,
        list_id: d.list_id,
        campaign_id: d.campaign_id,
        call_date: d.call_date,
        length_in_sec: d.length_in_sec,
        status: d.status,
        phone_number: d.phone_number,
        user: d.user,
        comments: d.comments,
        processed: d.processed,
        term_reason: d.term_reason,
      }
      worksheet.addRow(obj);

    });
    stream.on('end', function () {
     
      console.log("completed")
      var tempFilePath = exportFolder
      console.log(tempFilePath)
      workbook.xlsx.writeFile(tempFilePath).then(function () {
        console.log('file is written');
        response({
          status: true
        })
      });
      return {
        status: "gotit"
      }
    });

    stream.on('error', function (err) {
      console.log(err)
    });


  } catch (err) {
    console.log('OOOOOOO this is the error: ' + err);
  }


}

module.exports.fetchCountOfReport = function () {
  return global.db
    .count('*', {
      as: 'count'
    })
    .from('vicidial_log')
}
module.exports.fetchCountReportDataBetween = function (data) {
  console.log(data)
  if (data.limit == 0 && data.offset == 0) {
    return global.db
      .count('*', {
        as: 'count'
      })
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).whereIn('campaign_id', data.campaingId).orWhereIn('user', data.userId)
  } else {
    return global.db
      .count('*', {
        as: 'count'
      })
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).whereIn('campaign_id', data.campaingId).orWhereIn('user', data.userId).limit(data.limit).offset(data.offset)
  }
}
module.exports.fetchReportDataBetween = function (data) {
  console.log(data)
    if(data.campaingId.length==0){
      return global.db
      .select('status').count({ count: 'status' })
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).orWhereIn('user', data.userId).groupBy('status')
    }else if(data.userId.length==0){
      return global.db
      .select('status').count({ count: 'status' })
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).whereIn('campaign_id', data.campaingId).groupBy('status')
    } else if(data.userId.length==0 && data.campaingId.length==0){
      return global.db
      .select('status').count({ count: 'status' })
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).groupBy('status')
    }
    else{
      return global.db
      .select('status').count({ count: 'status' })
      .from('vicidial_log').whereBetween('start_epoch ', [data.datefrom, data.dateto]).whereIn('campaign_id', data.campaingId).orWhereIn('user', data.userId).groupBy('status')
    }
}
module.exports.fetchGroupsById = function (id) {
  return global.db
    .select('*')
    .from('vicidial_user_groups').where({
      user_group: id
    })
}
module.exports.fetchUserBYCampaingId = function (id) {
  return global.db.select('*').from('vicidial_live_agents').where({
    campaign_id: id
  })
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
    user_group: data.group,
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
    user_group: data.group,
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