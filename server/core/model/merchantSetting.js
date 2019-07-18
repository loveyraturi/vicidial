
module.exports.getMerchantSetings = function () {
  return global.db.select('value as item_id', 'locale as item_text').from('merchantsetting')
}

module.exports.getMerchantSetingsByValue = function (value) {
  return global.db.select('*')
    .from('merchantsetting')
    .where({ value: value })
}

module.exports.insertMerchantData = (data) => {
  global.db('merchantdata')
    .insert(data)
    .returning('*')
    .bind(console)
    .catch(console.error);
}

module.exports.getMerchantData = function () {
  return global.db.select('data')
    .from('merchantdata')
}

module.exports.clearMerchantInfo = () => {
  return new Promise((resolve) => {
    global.db('merchantdata')
      .del()
      .then((res) => {
        global.db('drl_pojofield')
          .where('featuretype', 'merchantinfo')
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

module.exports.insertMerchantDataPojoField = function (pojoField, pojoFieldDef) {

  global.db('drl_pojofield')
    .insert(pojoField)
    .returning('*')
    .bind(console)
    .then((res) => {
      let fieldId = res[0]
      let data1 = {
        "pojofieldid": fieldId,
        "defination": pojoFieldDef
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
    .catch(function (err) { console.log("-----------------------", err) });
}