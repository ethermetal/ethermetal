pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/WarehouseReceipt.sol";

contract OurNotifyContract is NotifyContract {
   bool public called;
   function saleNotify(uint recordId, uint price, uint from, uint to) returns (bool success) {
      return true;
   } 
}
contract TestNumismaticCoin {
  uint public initialBalance = 2 ether;

  function testInitialCreate() {
    WarehouseReceipt receipt = WarehouseReceipt(DeployedAddresses.WarehouseReceipt());

    Assert.equal(receipt.masterOwner(), msg.sender, "We should master of what we should created");
  }

  function testEmptyStr() {
    WarehouseReceipt receipt = WarehouseReceipt(DeployedAddresses.WarehouseReceipt());
    Assert.equal(receipt.emptyStr("abc"),false,"Detects string is not empty");
    Assert.equal(receipt.emptyStr(""),true,"Detects string is empty");
  }

  function testAddItem() { 
    WarehouseReceipt receipt = new WarehouseReceipt(DeployedAddresses.WarehouseReceipt());
    receipt.addWarehouse("testWarehouse");
    var item = receipt.addItem(msg.sender, "Test desc","http://testurl",0,now + (1 years),(1 ether), (0.5 ether));
    var item2 = receipt.addItem(msg.sender, "Test desc","http://testurl",0,now + (500 days),(1 ether), (0.5 ether));
  }
  
  function testBuyNoCallback() {
    WarehouseReceipt receipt = new WarehouseReceipt(DeployedAddresses.WarehouseReceipt());
    receipt.addWarehouse("testWarehouse");
    var item = receipt.addItem(msg.sender, "Test desc","http://testurl",0,now + (1 years),(1 ether), (0.5 ether));
    receipt.list(0,1 ether);
    receipt.buy.value(1 ether)(0);
  }
  function testBuyNoCallback() {
    WarehouseReceipt receipt = new WarehouseReceipt(DeployedAddresses.WarehouseReceipt());
    receipt.addWarehouse("testWarehouse");
    address notifyContractAddress = DeployedAddresses.OurNotifyContract();
    OurNotifyContract notifyContract = new OurNotifyContract(DeployedAddresses.OurNotifyContract());
    receipt.setNotifyAddress(notifyContractAddress);
    var item = receipt.addItem(msg.sender, "Test desc","http://testurl",0,now + (1 years),(1 ether), (0.5 ether));
    receipt.list(0, 1 ether);
    receipt.buy.value(1 ether)(0);
  }


  
  
}
