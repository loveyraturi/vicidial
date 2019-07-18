module.exports.getMcc = function () {
  // select * from drl_pojofield LEFT JOIN drl_pojo on drl_pojofield.pojoid = drl_pojo.id where name = 'RequestIso'
  return global.db.select('code as item_id', 'name as item_text')
    .from('mcc')
    .orderBy('orderindex', 'desc')
}