'use strict'
const feature = require('../services/feature')

const featureController = (function () {
  return {
    findFeatureTypeController: (req, res) => {
      feature.findFeatureType()
        .then(function (response) {
          return res.json(response);
        })
        .catch(function (e) {
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    findFeatureListController: (req, res) => {
      feature.findFeatureList()
        .then(function (response) {
          return res.json(response);
        })
        .catch(function (e) {
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    findActiveFeatureListController: (req, res) => {
      feature.findActiveFeatureList()
        .then(function (response) {
          let filterResponse = response.map((res) => {
            res.configuration = JSON.parse(res.configuration)
            return res
          })
          return res.json(filterResponse);
        })
        .catch(function (e) {
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    findFeatureTypeDetailsController: (req, res) => {
      feature.findFeatureTypeDetails(req.params.featuretypeid)
        .then(function (response) {
          return res.json(response);
        })
        .catch(function (e) {
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    getDuration: (req, res) => {
      feature.duration(function (response) {
        res.status(200).json(response)
      });
    },
    getCountryList: (req, res) => {
      feature.country(req.params.pojo, function (response) {
        res.status(200).json(response)
      });
    },
    getMccList: (req, res) => {
      // feature.mcc(req.params.pojo,function(response){
      //   res.status(200).json(response)
      // });
      //},
      feature.mcc(req.params.pojo, function (response) {
        response = JSON.parse(JSON.stringify(response));
        response = [].concat(...response.map(item => {
          const config = JSON.parse(JSON.stringify(item.configuration));
          return config;
        }).map(item => {
          var configlist = JSON.parse(item);
          configlist= configlist.map(result => {
            console.log("result mcc" , result)
            const list = {}
            list['item_id'] = result['value'];
            list['item_text'] = result['index'];
            return list;

          })
          return configlist;
        }))
        res.status(200).json(response);
      })
    },
    getMerchantData: (req, res) => {
      feature.getMerchantData()
        .then(function (response) {
          let returnRes = response.map((val) => {
            return JSON.parse(val.data)

          }
          )
          return res.json(returnRes);
        })
        .catch(function (e) {
          console.log(e)
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    getTransactionFields: (req, res) => {
      feature.transactionField(req.params.pojo, function (response) {
        res.status(200).json(response)
      });
    },
    marchantData: async (req, res) => {
      console.log("inside marc hanat");
      let data = [];
      //demoProcess.processFile(req, res, data);
      data = await feature.processFile(req, res);

      res.status(200).json(data);
    },
    getFeatureDetailsController: (req, res) => {
      feature.getFeatureDetails(req.params.featuretypeid)
        .then(function (response) {
          return res.json(response);
        })
        .catch(function (e) {
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    getFeatureDetailsForRuleController: (req, res) => {
      feature.getFeatureDetails(req.params.featuretypeid)
        .then(function (response) {
          let filterResponse = JSON.parse(response[0].configuration).map((value) => {
            let index = typeof value.index !== 'undefined' ? value.index : value.typetxt
            if (typeof value.checked == 'undefined') return { "item_id": index, "item_text": value.typetxt }
            return value.checked && value.checked == true ? { "item_id": index, "item_text": value.typetxt } : ''
          })
          return res.json(filterResponse.filter((value) => value != ''));
        })
        .catch(function (e) {
          console.log(e)
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    updateFeatureController: (req, res) => {
      feature.updateFeatureDetails(req.params.featureid, req.body, (status, response) => {
        res.status(status).json(response);
      })
    },
    createFeature: (req, res) => {
      feature.createFeature(req.body, (status, response) => {
        res.status(status).json(response);
      })
    },
    getDataSettings: (req, res) => {
      feature.getDataSettings()
        .then(function (response) {
          return res.json(response);
        })
        .catch(function (e) {
          res.status(500).json({ status: 'error', code: 'Error occur' });
        });
    },
    createFeatureCustom: (req, res) => {

      feature.createFeatureCustom(req.body, (status, response) => {
        res.status(status).json(response);
      })
    },
  }
})()
module.exports = featureController
