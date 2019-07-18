module.exports.getCardSetings = function () {
  return global.db.select('value as item_id', 'locale as item_text').from('cardsetting')
}
module.exports.fetchVelocityControls = function () {
  return global.db.select('*').from('velocity_control')
}
module.exports.updateVelocityControls = function (value,id) {
  global.db('velocity_control')
  .update(value)
  .where({id:id})
  .catch(function (error) {
    console.log(error)
  })

}
module.exports.getCardSetingsByValue = function (value) {
  return global.db.select('*').from('cardsetting').where({ value: value })
}