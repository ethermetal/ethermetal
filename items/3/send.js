var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
var pictures = ['QmbhgjbfrtXjaB7hf2FHpL62oR76rcrd3a1edMaEpzvkRQ', 'QmTi5RTCESP2B4TERnar7c4HXvTmwA5nLdSHGXruN9Xq9F','QmQML8QEeeWqweA2vWR3czgvrXmtXCpBytSZo6L1aQvXAd'];
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
                           "1946 BTW Commemorative Half Dollar MS 66", 
         getPictureUrls(),
           0, 1534457141,20022024226649300,166162639992024000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

