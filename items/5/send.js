var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
var pictures = ['QmdeWCKL2vk6x63xCuavReQZ2VGSZiMWYgC9bgHp5RvRuK','QmWKDcEvVvc2xAbuo8bxoUAnFo7JFac4DxwXCAgN3hmNip','QmXEGjmrNk2RjfVnkz6ys1yhNBGE7W57GciAaeG4Z89Yop'];
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
                           "1913-D Buffalo Nickel Type 2 XF 40",
         getPictureUrls(),
           0, 1534457141,34037441185303800,166162639992024000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

