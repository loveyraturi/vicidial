module.exports.getDuration = function() {
    return global.db.select('*').from('durationsettings')
  }
  module.exports.getDurationByValue = function(value) {
    return global.db
      .select('*')
      .from('durationsettings')
      .where({
        value: value
      })
  }  