var WarehouseReceipt = artifacts.require("./WarehouseReceipt.sol");

module.exports = function(deployer) {
  deployer.deploy(WarehouseReceipt).then(function() {
     WarehouseReceipt.deployed().then( (instance)=>{
         instance.addWarehouse("Alex & Son Coins 1413 Grant Ave, Novato, CA 94945");
     });
  });
};
