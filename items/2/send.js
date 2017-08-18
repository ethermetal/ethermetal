var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var config = require ('../config');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
module.exports = function(callback) {
  console.log("start");
  WarehouseReceiptContract.deployed().then( (instance)=>{
          var act = config.act; 
          instance.addItem(act, 
                           "1938-D Buffalo Nickel MS 66+", 
          "https://gateway.ipfs.io/ipfs/Qmek8qecxiJhXYAKnhKBjMiJhUHV1H78bGD9Km6RE74gem\nhttps://gateway.ipfs.io/ipfs/QmVRYr4hg1z8fkPmJ2YDsDtqssi1LWwAKT5vsEdwcsfTaa\nhttps://gateway.ipfs.io/ipfs/QmZizxLVwdCv8bgySq2x1HKKfy5KWJyXNfjhfT2MEf5ErW",
           0, 1534457141,15016518169987000,166162639992024000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

