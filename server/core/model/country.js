module.exports.getCountry = function () {
  return global.db.select('code as item_id', 'name as item_text')
    .from('country')
    .orderBy('orderindex', 'desc')
}