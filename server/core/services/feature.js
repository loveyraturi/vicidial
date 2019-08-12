const path = require('path')
var feature = require('../model/feature')
var merchant = require('../model/merchantSetting')
var rules = require('../model/ruleset')
var mcc = require('../model/mcc')
var duration = require('../model/duration')
var country = require('../model/country')
var restClient = require('node-rest-client').Client;
var csv = require('csv-parser')
var fs = require('fs')
var _ = require('lodash')
var request = require("request");

module.exports.findFeatureType = () => {
  return feature.findFeatureType()
}

module.exports.findFeatureList = () => {
  return feature.findFeatureList()
}
module.exports.findActiveFeatureList = () => {
  return feature.findActiveFeatureList(1)
}
module.exports.findFeatureTypeDetails = (featuretypeid) => {
  return feature.findFeatureTypeDetails(featuretypeid)
}
module.exports.mcc = (pojo, sendResponse) => {
  mcc.getMcc().then(sendResponse)
}
module.exports.getMerchantData = () => {
  return merchant.getMerchantData()
}
module.exports.duration = (sendResponse) => {
  duration.getDuration().then(sendResponse)
}
module.exports.country = (pojo, sendResponse) => {
  country.getCountry().then(sendResponse)
}
module.exports.transactionField = (pojo, sendResponse) => {
  rules.getTransactionField(pojo).then(sendResponse)
}
module.exports.processFile = async (req, res) => {
  var clearStatus = await cleanMerchantData()
  var result = await generateData(req, res);
  //console.log(result)
  return result;
}
function cleanMerchantData() {
  return merchant.clearMerchantInfo()
}
function createPojoField(data) {
  var count = 0
  Object.keys(data).map((key) => {
    let field = key
    let value = data[key]
    var defination = {}
    var locale = ''
    var type = ''
    var featureType = 'merchantdata'
    if (isNaN(value)) {
      // String Value
      let def = {
        "compare": {
          "compareType": "Equal|Not Equal",
          "type": "text"
        }
      }
      defination = JSON.stringify(def)
      type = 'string'
    }
    else {
      let def = {
        "compare": {
          "compareType": "Equal|Not Equal|Greater Than|Less Than",
          "type": "text"
        }
      }
      defination = JSON.stringify(def)
      type = 'integer'
    }

    let keySpaceReplace = key.replace(/_/g, ' ');
    locale = _.startCase(_.toLower(keySpaceReplace))
    if (count > 0) {
      merchant.insertMerchantDataPojoField(
        {
          pojoid: 6,
          field: key,
          dbfield: key,
          type: type,
          locale: locale,
          orderIndex: 3,
          active: 1,
          featuretype: 'merchantinfo',
          source: ''
        },
        defination
      )
    }
    count = 1
  })
}

function generateData(req, res) {
  let csvData = [];
  var loopCount = 0;
  //var obj = csv1(); 
  return new Promise(resolve => {
    let uploadPath = path.join(__dirname, '../../../uploads/');
    let dataFile = req.files.file;



    dataFile.mv(`${uploadPath + dataFile.name}`, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      else {

        var options = {
          method: 'POST',
          url: process.env.FEATURE_ENGINE_BASE_URL + '/uploadmerchantdata',
          headers:
            {
              'cache-control': 'no-cache',
              'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            },
          formData:
            {
              file:
                {
                  value: fs.createReadStream(`${uploadPath + dataFile.name}`),
                  options: { filename: dataFile.name, contentType: null }
                }
            }
        };

        request(options, function (error, response, body) {
          console.log(error)
        });


        await fs.createReadStream(`${uploadPath + dataFile.name}`)
          .pipe(csv())
          .on('data', (data) => {
            sqlData = {
              data: JSON.stringify(data)
            }
            if (loopCount == 0) {
              loopCount = 1
              createPojoField(data)
            }
            merchant.insertMerchantData(sqlData)
          })
          //  .on('data', await function (data) {
          //   var datanew = Object.keys(data).map(function(key, index) {
          //     var obj = {};
          //     obj[key.replace(/'/g, "").replace(/ /g, "")] = data[key]
          //     return obj
          //   });
          //   sqlData = {
          //     data: JSON.stringify(datanew)
          //   }
          //   merchant.insertMerchantData(sqlData)
          //  })
          .on('end', function () {
            resolve({ status: true });
          });

      }
    })
  });
}

module.exports.getFeatureDetails = (featuretypeid) => {
  return feature.getFeatureDetails(featuretypeid)
}

module.exports.createFeature = async(data, response) => {

  var featureName = data.configuration[0].typetxt.split(' ').join('_').toLowerCase();
  data.configuration[0].index = featureName
  // Insert information into feature table
  var dataInsert = {
    "type": "non-functional",
    "name": data.configuration[0].typetxt,
    "status":0,
    "configuration": JSON.stringify(data.configuration),
    "featuretype": 1
  }
  feature.insertFeatureInfo(dataInsert, response)

}

module.exports.updateFeatureDetails = (featuretypeid, data, response) => {

  // Communication with Java
  let featureDetails = feature.getFeatureDetails(featuretypeid).then(function (response) {

    var client = new restClient()
    var configuration = JSON.parse(data.configuration)
    console.log(configuration)
    ksqlquery = response[0].ksqlquery
    if (configuration[0].max) {
      let arrConfigurationStr4Java = configuration.map((config) => {
        if (!config.index) {
          var index = config.typetxt.split(' ').join('_');
          index = index.toLowerCase();
        }
        else {
          var index = config.index
        }
        return config.min + '-' + config.max + '#' + index
      })
      var configurationStr4Java = arrConfigurationStr4Java.join(',')

      //ksqlquery = ksqlquery.replace(/%datajson%/g, configurationStr4Java);

    }




    var req = {
      data: {
        "featue_name": response[0].name_ksql,
        "configuration": configuration,
        "is_dependent": false
      },
      headers: { "Content-Type": "application/json" }
    };


    var req = client.post(process.env.FEATURE_ENGINE_BASE_URL + "/updatebindetails", req, function (data, res) {
      //fulfill(data)
      console.log("-----------------------")
    });

  })
  // Communication with java end here

  // Configure feature json

  let configuration = data.configuration.map((config) => {
    if (!config.index) {
      let index = config.typetxt.split(' ').join('_');
      config.index = index.toLowerCase();
    }
    return config
  })
  data.configuration = JSON.stringify(data.configuration)
  return feature.updateFeatureDetails(featuretypeid, data, response)
}


module.exports.getDataSettings = () => {
  return feature.getDataSettings()
}

module.exports.createFeatureCustom = async (featureConfigData, response) => {
  //let objFeatureConfigData = JSON.parse(featureConfigData)
  var javaJsonArr = []
  let finalJavaPojoObject = {
    "regx": featureConfigData.regx,
    "identity": featureConfigData.identity,
    "type": featureConfigData.type
  }
  await Promise.all(featureConfigData.fields.map((featureCustom) => {
    let featureName = featureCustom.featureName.trim();
    let featureType = featureCustom.featureType == 'integer' ? 'integer' : 'string';
    let orderRank = featureCustom.orderRank

    let javaJson = {
      "name": featureName.toLowerCase().replace(/ /g, "_"),
      "type": featureType == 'integer' ? 'DOUBLE' : 'VARCHAR',
      "isDateTime": featureCustom.featureType == 'datetime' ? true : false,
      "regx": 'NA'
    }
    javaJsonArr.push(javaJson)
  }))

  finalJavaPojoObject = {
    "regx": featureConfigData.regx,
    "identity": featureConfigData.identity,
    "type": featureConfigData.type,
    "fields": javaJsonArr
  }
  var client = new restClient()
  var args = {
    data: finalJavaPojoObject,
    headers: {
      "Content-Type": 'application/json'
    }
  };

  let url = process.env.JAVA_RULE_ENGINE_URL_ACQUIRER + "/validateStream";
  var req = client.post(url, args, async function (data, res) {
    if (Buffer.isBuffer(data)) {
      data = data.toString('utf8');
    }
    let dataObj = JSON.parse(data)
    if (typeof dataObj.status!==undefined && dataObj.status == 200) {
      // Insert Into DB
      let promise = new Promise((resolve, reject) => {
        let dataSettingObj = {
          "template_name": featureConfigData.identity,
          "regular_expression": featureConfigData.regx,
          "type": featureConfigData.type
        }
        feature.insertDataSettingTemplate(dataSettingObj).then((res1) => {
          resolve(res1)
        })
      });
      var templateId = await promise;

      await Promise.all(featureConfigData.fields.map((featureCustom) => {
        let featureName = featureCustom.featureName.trim();
        let featureType = featureCustom.featureType == 'integer' ? 'integer' : 'string';
        let orderRank = featureCustom.orderRank

        let objDrlPojofield = {
          'pojoid': 6,
          'field': featureName.toLowerCase().replace(/ /g, "_"),
          'dbfield': featureName.toLowerCase().replace(/ /g, "_"),
          'type': featureType,
          'locale': featureName,
          'orderIndex': orderRank,
          'isDependent': 0,
          'active': 0,
          'source': '',
          'featuretype': 2,
          'datasetting_templateid': templateId
        }

        let objDrlPojofieldDef = featureType == 'string' ?
          { 'defination': '{"compare":{"compareType":"Equal|Not Equal|In|Not in|Contains|startsWith|endsWith","type":"text"}}' } :
          { 'defination': '{"compare":{"compareType":"Equal|Not Equal|Greater Than|Less Than","type":"text"}}' }

        feature.insertFeatureInfoCustom(objDrlPojofield, objDrlPojofieldDef)
      }))

      response(200, { "status": true, "response": "Feature Created Successfully" })
    }
    else if(typeof dataObj.status!==undefined && dataObj.status == 400 && dataObj.message =="Topic already registered."){
      module.exports.createFeatureCustom(featureConfigData, response)
    }
    else{
      response(500, { "status": false, "response": dataObj.message })
    }

  });
  req.on('requestTimeout', function (req) {
    console.log('request has expired');
  });
  req.on('responseTimeout', function (res) {
    console.log('response has expired');
  });

  //it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
  req.on('error', function (err) {
    console.log('request error', err);
  });
}
