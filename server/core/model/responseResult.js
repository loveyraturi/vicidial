var counterHistoricalIso = 0
var historicalIsoDataArr = Array()
const dateSub = require('../config/sqlGrammer').dateSub

module.exports.getResponseResult = function (response) {

  global.db.select('a.merchants_type')
    .count({
      immediate_count: ['a.merchants_type']
    })
    .from('response AS a')
    .innerJoin('response_rules AS b', 'a.stan', 'b.stan')
    .where('b.rule_name', '=', 'Response_From_Rule')
    .where('b.action', '=', 'immediate')
    .groupBy('a.merchants_type').then(response)

}

var consolidateHistoricalIso = function (field, value, response) {
  counterHistoricalIso = counterHistoricalIso + 1
  historicalIsoDataArr[field] = value;

  if (counterHistoricalIso == 8) {
    response(Object.assign({}, historicalIsoDataArr))
  }
}

module.exports.getHistoricalISOMessage = function (value, timestamp, response) {

  var sql = global.db.select('incomming_message.*', 'mcc_code.MCC_GROUP', 'proccode_trxn_type.ORIGIN_DESC', 'proccode_cardtype.CARD_DESC', 'pan_entry.CARD_DESC as pan_entry_mode', 'currency_code.CURRENCY', 'incomming_message.transmissionDateAndTime as date_time', 'response_code.RESPONSE_GROUP as responseCode')
    .from('incomming_message')
    .leftJoin('mcc_code', 'incomming_message.merchantstype', '=', 'mcc_code.MCC_CODE')
    .leftJoin('proccode_trxn_type', global.db.raw('SUBSTRING(incomming_message.processingcode,1,2)'), '=', 'proccode_trxn_type.POSCODE')
    .leftJoin('proccode_cardtype', global.db.raw('SUBSTRING(incomming_message.processingcode,3,2)'), '=', 'proccode_cardtype.PROC_CODE')
    .leftJoin('pan_entry', global.db.raw('SUBSTRING(incomming_message.pointofserviceentrymode,1,2)'), '=', 'pan_entry.PAN_ENTRY_MODE')
    .leftJoin('currency_code', global.db.raw('SUBSTRING(incomming_message.pointofserviceentrymode,1,2)'), '=', 'pan_entry.PAN_ENTRY_MODE')
    .leftJoin('response_code', 'response_code.RESPONSE_CODE_NUMBER', '=', 'incomming_message.responseCode')
    .where('incomming_message.transmissiondateandtime', '<=', timestamp)
    .where('primaryAccountNumber', '=', value)
    .orWhere('merchantstype', '=', value)
    .orderBy('incomming_message.transmissiondateandtime', 'desc')
    .limit(20).then(function (res) {
      consolidateHistoricalIso('trx_details', res, response)
    })



  var count24h = global.db('incomming_message').count(
    {
      count24h: ['*']
    }
  ).where('transmissionDateAndTime', '<=', timestamp)
    .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
    .where('responseCode', '=', '00')
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 24 HOUR),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('count24hResponse', res, response)
    })

  var count7d = global.db('incomming_message').count(
    {
      count7d: ['*']
    }
  ).where('transmissionDateAndTime', '<=', timestamp)
    .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
    .where('responseCode', '=', '00')
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('count7dResponse', res, response)
    })

  var countAllTrx24h = global.db('incomming_message').count(
    {
      countAllTrx24h: ['*']
    }
  )
    .where('transmissionDateAndTime', '<=', timestamp)
    .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 24 HOUR),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('countAllTrx24hResponse', res, response)
    })

  var countAllTrx7d = global.db('incomming_message').count(
    {
      countAllTrx7d: ['*']
    }
  )
    .where('transmissionDateAndTime', '<=', timestamp)
    .whereRaw('primaryAccountNumber = ? or merchantsType= ?', [value, value])
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('countAllTrx7dResponse', res, response)
    })
  var countDeclinedTrx7d = global.db('incomming_message').count(
    {
      countDeclinedTrx: ['*']
    }
  )
    .where('transmissionDateAndTime', '<=', timestamp)
    .where('responseCode', '!=', '00')
    .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('countDeclinedTrxResponse', res, response)
    })


  var sum24h = global.db('incomming_message').sum(
    {
      sum24h: ['amountTransaction']
    }
  )
    .where('transmissionDateAndTime', '<=', timestamp)
    .where('responseCode', '=', '00')
    .whereRaw('primaryAccountNumber = ? or merchantsType= ?', [value, value])
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 24 HOUR),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('sum24hResponse', res, response)
    })

  var sum7d = global.db('incomming_message').sum(
    {
      sum7d: ['amountTransaction']
    }
  )
    .where('transmissionDateAndTime', '<=', timestamp)
    .where('responseCode', '=', '00')
    .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
    .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
    .then(function (res) {
      consolidateHistoricalIso('sum7dResponse', res, response)
    })

}


module.exports.getHistoricalISOMessageAcquirerByStan = function (value, response) {
  //var sql = "SELECT incomming_message_acquirer.*,mcc_code.MCC_GROUP,proccode_trxn_type.ORIGIN_DESC,proccode_cardtype.CARD_DESC, pan_entry.CARD_DESC as pan_entry_mode,date_format(incomming_message_acquirer.transmissionDateAndTime,'%Y-%m-%d %H:%i:%s') as date_time, response_code.RESPONSE_GROUP as responseCode from incomming_message_acquirer LEFT JOIN mcc_code on incomming_message_acquirer.merchantsType = mcc_code.MCC_CODE LEFT JOIN proccode_trxn_type on SUBSTRING(incomming_message_acquirer.processingCode,1,2) = proccode_trxn_type.POSCODE LEFT JOIN proccode_cardtype on SUBSTRING(incomming_message_acquirer.processingCode,3,2) = proccode_cardtype.PROC_CODE LEFT JOIN pan_entry on SUBSTRING(incomming_message_acquirer.pointOfServiceEntryMode,1,2) = pan_entry.PAN_ENTRY_MODE LEFT JOIN response_code on response_code.RESPONSE_CODE_NUMBER=incomming_message_acquirer.responseCode where systemTraceAuditNumber='"+value+"'"

  var sql = global.db.select(
    'incomming_message_acquirer.*',
    'mcc_code.MCC_GROUP',
    'proccode_trxn_type.ORIGIN_DESC',
    'proccode_cardtype.CARD_DESC',
    'pan_entry.CARD_DESC as pan_entry_mode',
    'incomming_message_acquirer.transmissionDateAndTime as date_time',
    'response_code.RESPONSE_GROUP as responseCode'
  )
    .from('incomming_message_acquirer')
    .leftJoin('mcc_code', 'incomming_message_acquirer.merchantsType', '=', 'mcc_code.MCC_CODE')
    .leftJoin('proccode_trxn_type', global.db.raw('SUBSTRING(incomming_message_acquirer.processingCode,1,2)'), '=', 'proccode_trxn_type.POSCODE')
    .leftJoin('proccode_cardtype', global.db.raw('SUBSTRING(incomming_message_acquirer.processingCode,3,2)'), '=', 'proccode_cardtype.PROC_CODE')
    .leftJoin('pan_entry', global.db.raw('SUBSTRING(incomming_message_acquirer.pointOfServiceEntryMode,1,2)'), '=', 'pan_entry.PAN_ENTRY_MODE')
    .leftJoin('response_code', 'response_code.RESPONSE_CODE_NUMBER', '=', 'incomming_message_acquirer.responseCode')
    .where('systemTraceAuditNumber', '=', value)
    .then(response)

}
module.exports.getHistoricalISOMessageIssuerByStan = function (value, response) {
  var sql = global.db.select(
    'incomming_message.*',
    'mcc_code.MCC_GROUP',
    'proccode_trxn_type.ORIGIN_DESC',
    'proccode_cardtype.CARD_DESC',
    'pan_entry.CARD_DESC as pan_entry_mode',
    'incomming_message.transmissionDateAndTime as date_time',
    'response_code.RESPONSE_GROUP as responseCode'
  ).from('incomming_message')
    .leftJoin('mcc_code', 'incomming_message.merchantsType', '=', 'mcc_code.MCC_CODE')
    .leftJoin('proccode_trxn_type', global.db.raw('SUBSTRING(incomming_message.processingCode,1,2)'), '=', 'proccode_trxn_type.POSCODE')
    .leftJoin('proccode_cardtype', global.db.raw('SUBSTRING(incomming_message.processingCode,3,2)'), '=', 'proccode_cardtype.PROC_CODE')
    .leftJoin('pan_entry', global.db.raw('SUBSTRING(incomming_message.pointOfServiceEntryMode,1,2)'), '=', 'pan_entry.PAN_ENTRY_MODE')
    .leftJoin('response_code', 'response_code.RESPONSE_CODE_NUMBER', '=', 'incomming_message.responseCode')
    .where('systemTraceAuditNumber', '=', value)
    .then(response)
}

module.exports.getHistoricalISOMessageAcquirer = function (value, timestamp, response) {
  counterHistoricalIso = 0
  historicalIsoDataArr = historicalIsoDataArr.splice(0, historicalIsoDataArr.length)
  


  
  var sql = global.db.select(
    'incomming_message_acquirer.*',
    'mcc_code.mcc_group',
    'proccode_trxn_type.origin_desc',
    'proccode_cardtype.card_desc',
    'pan_entry.card_desc as pan_entry_mode',
    'currency_code.currency',
    'incomming_message_acquirer.transmissiondateandtime as date_time',
    'response_code.response_group as responseCode'
  ).from('incomming_message_acquirer')
    .leftJoin('mcc_code', 'incomming_message_acquirer.merchantstype', '=', 'mcc_code.mcc_code')
    .leftJoin('proccode_trxn_type', global.db.raw('SUBSTRING(incomming_message_acquirer.processingcode,1,2)'), '=', 'proccode_trxn_type.poscode')
    .leftJoin('proccode_cardtype', global.db.raw('SUBSTRING(incomming_message_acquirer.processingcode,3,2)'), '=', 'proccode_cardtype.proc_code')
    .leftJoin('pan_entry', global.db.raw('SUBSTRING(incomming_message_acquirer.pointofserviceentrymode,1,2)'), '=', 'pan_entry.pan_entry_mode')
    .leftJoin('currency_code', global.db.raw('SUBSTRING(incomming_message_acquirer.pointofserviceentrymode,1,2)'), '=', 'pan_entry.pan_entry_mode')
    .leftJoin('response_code', 'response_code.response_code_number', '=', 'incomming_message_acquirer.responsecode')
    .where('incomming_message_acquirer.transmissiondateandtime', '<=', timestamp)
    .where('primaryaccountnumber', '=', value)
    .orWhere('merchantstype', '=', value)
    .orderBy('incomming_message_acquirer.transmissiondateandtime', 'desc')
    .limit(20).then(function (res) {
      consolidateHistoricalIso('trx_details', res, response)
    })

  var count24h = global.db('incomming_message_acquirer').count(
    {
      count24h: ['*']
    }
  ).where('transmissiondateandtime', '<=', timestamp)
    .whereRaw('(primaryaccountnumber = ? or merchantstype= ?)', [value, value])
    .where('responsecode', '=', '00')
    .whereRaw("transmissiondateandtime between '"+dateSub(timestamp, 24, 'hour')+"' and ?", [timestamp])
    .then(function (res) {
      consolidateHistoricalIso('count24hResponse', res, response)
    })


   var count7d = global.db('incomming_message_acquirer').count(
     {
       count7d: ['*']
     }
   ).where('transmissiondateandtime', '<=', timestamp)
     .whereRaw('(primaryaccountnumber = ? or merchantstype= ?)', [value, value])
     .where('responsecode', '=', '00')
     .whereRaw("transmissiondateandtime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
     .then(function (res) {
       consolidateHistoricalIso('count7dResponse', res, response)
     })
 
  /* var countAllTrx24h = global.db('incomming_message_acquirer').count(
     {
       countAllTrx24h: ['*']
     }
   )
     .where('transmissionDateAndTime', '<=', timestamp)
     .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
     .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 24 HOUR),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
     .then(function (res) {
       consolidateHistoricalIso('countAllTrx24hResponse', res, response)
     })
 
   var countAllTrx7d = global.db('incomming_message_acquirer').count(
     {
       countAllTrx7d: ['*']
     }
   )
     .where('transmissionDateAndTime', '<=', timestamp)
     .whereRaw('primaryAccountNumber = ? or merchantsType= ?', [value, value])
     .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
     .then(function (res) {
       consolidateHistoricalIso('countAllTrx7dResponse', res, response)
     })
   var countDeclinedTrx7d = global.db('incomming_message_acquirer').count(
     {
       countDeclinedTrx: ['*']
     }
   )
     .where('transmissionDateAndTime', '<=', timestamp)
     .where('responseCode', '!=', '00')
     .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
     .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
     .then(function (res) {
       consolidateHistoricalIso('countDeclinedTrxResponse', res, response)
     })
 
 
   var sum24h = global.db('incomming_message_acquirer').sum(
     {
       sum24h: ['amountTransaction']
     }
   )
     .where('transmissionDateAndTime', '<=', timestamp)
     .where('responseCode', '=', '00')
     .whereRaw('primaryAccountNumber = ? or merchantsType= ?', [value, value])
     .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 24 HOUR),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
     .then(function (res) {
       consolidateHistoricalIso('sum24hResponse', res, response)
     })
 
   var sum7d = global.db('incomming_message_acquirer').sum(
     {
       sum7d: ['amountTransaction']
     }
   )
     .where('transmissionDateAndTime', '<=', timestamp)
     .where('responseCode', '=', '00')
     .whereRaw('(primaryAccountNumber = ? or merchantsType= ?)', [value, value])
     .whereRaw("transmissionDateAndTime between date_format(DATE_SUB(?, INTERVAL 7 DAY),'%y%m%d%H%i%s') and ?", [timestamp, timestamp])
     .then(function (res) {
       consolidateHistoricalIso('sum7dResponse', res, response)
     })
 
     */

}