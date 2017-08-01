var NumismaticCoin = artifacts.require("./NumismaticCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(NumismaticCoin).then(function() {
     NumismaticCoin.deployed().then( (instance)=>{
         instance.addWarehouse("Alex & Son Coins 1413 Grant Ave, Novato, CA 94945");
     });
  });
};
