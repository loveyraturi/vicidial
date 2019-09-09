module.exports.getCountry = function () {
//   return global.db.select('code as item_id', 'name as item_text')
//     .from('country')
//     .orderBy('orderindex', 'desc')
return global.db.column([
  {configuration: 'configuration'},
  {ksqlquery: 'ksqlquery'},
  {name_ksql: 'name_ksql'}
])
.select()
.from('feature').as('feature')
.where({ parentfield: 'List Country' })
}

