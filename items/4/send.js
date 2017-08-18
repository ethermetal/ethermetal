var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var Web3 = require("web3");
var config = require ('../config');
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
var pictures = ['QmRTdnMJjjEtgfaUEsKWe63bxdXDQ6mDkfeyVw5bChvguV','QmXBvb7z3jpU76pf3gp6YBYw5TAbja397rsHaMeLntzRad','QmVXKNoFMCjnUF1rPMcJwpqd3ejLxFu69v6N1QD9WxrXBg'];
function getPictureUrls() {
    return pictures.map(function(p) {
        return('https://gateway.ipfs.io/ipfs/' + p);
    }).join("\n");
}
module.exports = function(callback) {
  console.log("start");
  WarehouseReceiptContract.deployed().then( (instance)=>{
          var act = config.act;
          instance.addItem(act, 
                           "1913-S Buffalo Nickel Type 2 AU 55", 
         getPictureUrls(),
           0, 1534457141,110121133246571000,166162639992024000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

