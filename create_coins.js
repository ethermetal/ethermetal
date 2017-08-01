
var NumismaticCoinContract = artifacts.require('NumismaticCoin');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
module.exports = function(callback) {
  console.log("start");
  NumismaticCoinContract.deployed().then( (instance)=>{
      web3.eth.getAccounts(function(err, accs) {
          var act = accs[0];
          instance.addCoin(act, "Test coin", "https://gateway.ipfs.io/ipfs/QmW7qjBEg251HEhdsZSGQZd2WVuhCs3Uouv79MGLRW62WB\nhttps://gateway.ipfs.io/ipfs/QmXL2euJW6peommtB2nzPQpvPpwUFZQDNpMPqdiP7HLUby", 0, 1532799000,1.5e13,1.5e12, {from: act, gas:500000}).then( (tr) => {
                 console.log("Added coin");
          });
      });
  });
}
