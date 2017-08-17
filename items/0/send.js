var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var Web3 = require("web3");

var config = require ('../config');

var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
module.exports = function(callback) {
  console.log("start");
  WarehouseReceiptContract.deployed().then( (instance)=>{
          var act=config.act;
          instance.addItem(act, 
                           "1837 $5 US Gold Piece AU 55", 
          "https://gateway.ipfs.io/ipfs/QmW7qjBEg251HEhdsZSGQZd2WVuhCs3Uouv79MGLRW62WB\nhttps://gateway.ipfs.io/ipfs/QmXL2euJW6peommtB2nzPQpvPpwUFZQDNpMPqdiP7HLUby\nhttps://gateway.ipfs.io/ipfs/QmQfeZKZmNofsNpzuHkH45ac9U73Ueie4SAzBMHfNRyv6f"
           , 0, 1534457141,523412315974876000,332325279984048000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

