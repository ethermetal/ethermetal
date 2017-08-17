var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
var pictures = ['QmQv6owEKCQHEjmLmHZMPpXis35uif3vu1hWLmXE3vLTeK','QmWc1FCv6wu68mUh2A6B7RPUT459wmLSeJWRVfd4mwb6ez','QmYpiqLbBX1Qgu51diBVAooWbLTu7KTxUUwHLGTJ7MqW9v'];
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
                           "1948 Franklin Half Dollar MS 64 FBL",
         getPictureUrls(),
           0, 1534457141,18019821803984400,166162639992024000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

