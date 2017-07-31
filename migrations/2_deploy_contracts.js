var NumismaticCoin = artifacts.require("./NumismaticCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(NumismaticCoin);
};
