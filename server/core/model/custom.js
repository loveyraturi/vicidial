module.exports.getCustomTableInfo = function(table, value) {
    // select * from drl_pojofield LEFT JOIN drl_pojo on drl_pojofield.pojoid = drl_pojo.id where name = 'RequestIso'
    return global.db.select(['*'])
          .from(table)
          .where({ code: value })
  }

  module.exports.getCustomAccuireTableInfo = function(table, value) {
    // select * from drl_accuire_pojofield LEFT JOIN drl_pojo on drl_accuire_pojofield.pojoid = drl_pojo.id where name = 'RequestIso'
    return global.db.select(['*'])
          .from(table)
          .where({ code: value })
  }