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
module.exports.fetchGroupsByUser = function (userid) {
  return global.db
    .select('*')
    .from('groupuser').leftJoin('groups', 'groupuser.groupid', 'groups.id').where({
      userid: userid
    })
}

module.exports.fetchGroups = function () {
  return global.db
    .select('*')
    .from('vicidial_user_groups')
}

module.exports.authenticate = function (data) {
  console.log(data)
  return global.db
    .select('*')
    .from('vicidial_users').where({
      phone_login: data.userName,
      phone_pass: data.password
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

module.exports.deleteUser = (id, response) => {

  return global.db('vicidial_users').where('user_id', id)
    .del().then(() => {
          response({
            status: true
          })
    }).catch(console.error);

}