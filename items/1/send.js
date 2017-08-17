var WarehouseReceiptContract = artifacts.require('WarehouseReceipt');
var config = require ('../config');

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
module.exports = function(callback) {
  console.log("start");
  WarehouseReceiptContract.deployed().then( (instance)=>{
          var act = config.act; //"0x20b00b508c9c82fcfb59fd540e3a003c0b9d24ef";// "0x0027E07e7BF0ef7f89B1b3fE9b6F73657bBC3aD9";
          instance.addItem(act, 
                           "1812 Capped Bust Half Dollar XF40", 
          "https://gateway.ipfs.io/ipfs/QmUGjeuJMoZ3AYf9MiXhSsQnLkSWPB1vUoCuBnaQW8oYyv\nhttps://gateway.ipfs.io/ipfs/QmfHKiuw2BQmFNLtPxhpdNabAGLVuSp5quiYfiL2xjS9Pm\nhttps://gateway.ipfs.io/ipfs/QmXHTsYerQ6F5eVKJp8q7MH9n87PSwHR6xFP2QYBeXZnYY",
           0, 1534457141,105532752694631000,166162639992024000, {from: act, gas:900000}).then( (tr) => {
                 console.log("Added coin");
      });
  });
}

