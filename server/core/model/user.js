module.exports.fetchUsers = function () {
  return global.db
    .select('*')
    .from('user').orderBy('id', 'desc')
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
    .from('groups')
}

module.exports.createUser = function (data, response) {
  var userdetails={
    name:data.name,
    phonenumber:data.phonenumber,
    status:data.status,
    password:data.password
  }
  return global.db('user')
    .insert(userdetails)
    .returning('id')
    .then((res) => {
      var userid=res[0]
      data.groups.forEach(element => {
        var groups={
          groupid: element,
          userid: userid
        }
        global.db('groupuser').insert(groups)
        .returning('id').then((resp) => {
          
        }).catch((error) => {
          console.log(error);
          response({
            "error": error.sqlMessage
          })
        })
      });
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

module.exports.updateUser = function (data, response) {

  return global.db.table('user')
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

module.exports.deleteUser = (id, response) => {

  return global.db('user').where('id', id)
    .del().then(() => {
      response({
        status: true
      })
    })
    .catch(console.error);

}