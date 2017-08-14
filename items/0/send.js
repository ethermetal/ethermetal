var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8550"));
module.exports = function(callback) {
  console.log("start");
  WarehouseReceiptContract.deployed().then( (instance)=>{
          var act = "0x0027E07e7BF0ef7f89B1b3fE9b6F73657bBC3aD9";
          instance.addItem(act, 
                           "1837 $5 PCGS AU55", 
          "https://gateway.ipfs.io/ipfs/QmW7qjBEg251HEhdsZSGQZd2WVuhCs3Uouv79MGLRW62WB\nhttps://gateway.ipfs.io/ipfs/QmXL2euJW6peommtB2nzPQpvPpwUFZQDNpMPqdiP7HLUby\nhttps://gateway.ipfs.io/ipfs/QmQfeZKZmNofsNpzuHkH45ac9U73Ueie4SAzBMHfNRyv6f"
           , 0, 1533860142,532000000000000000,338000000000000000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

