pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NumismaticCoin.sol";

contract TestNumismaticCoin {

  function testInitialCreate() {
    NumismaticCoin nCoin = NumismaticCoin(DeployedAddresses.NumismaticCoin());

    Assert.equal(nCoin.masterOwner(), msg.sender, "We should master of what we should created");
  }

  function testEmptyStr() {
    NumismaticCoin nCoin = NumismaticCoin(DeployedAddresses.NumismaticCoin());
    Assert.equal(nCoin.emptyStr("abc"),false,"Detects string is not empty");
    Assert.equal(nCoin.emptyStr(""),true,"Detects string is empty");
  }

  function testAddCoin() { 
    NumismaticCoin nCoin = new NumismaticCoin();
    var coinId = nCoin.addCoin(msg.sender, "Test desc","http://testurl",0,now + (1 years),(1 ether), (0.5 ether));
    Assert.equal(nCoin.getAmountDue(coinId), (1 ether), "Amount due not consistent with fee");
    var coinId2 = nCoin.addCoin(msg.sender, "Test desc","http://testurl",0,now + (500 days),(1 ether), (0.5 ether));
  }
  
}
