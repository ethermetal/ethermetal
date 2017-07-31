pragma solidity ^0.4.13;

contract NumismaticCoin {
    struct Record {
        // Who currently owns the item. This will be 0 if it has been assigned
        address owner;
        // Simple description of the item
        string description;
        // If made non-negotiable it must be assigned to an actual person for pickup
        string assignee;
        // URLs for images of coin should be on IPFS. Seperated by new line
        string imgUrls;
        // The warehouse where the item is stored
        uint warehouse;
        // When the fees were last set. The fees may only be raised by a max of 4% once per year
        uint feesLastChanged;
        // The timestamp through which storage is paid. If the storage fee is over a year late, it can be repoed
        uint storagePaidThru;
        // The yearly storage fee for storing the item in wei
        uint storageFee;
        // The late fee due if storage fee is not paid on time in wei
        uint lateFee;
        // If the item has been picked up this will be true.
        bool pickedUp;
        // If the item has repoed. This can occur if the storage fees are over a year past due
        bool repoed;
        // If the item is lost or stolen
        bool lostOrStolen;
    }

    // Notify a numismatic coin has been transferred    
    event Transfer (
        uint recordId,
        address from,
        address to
    );
   

    // Assign a coin to a name for pickup
    event Assignment (
        uint recordId,
        string assignee
    );

    // Occurs when a coin has actually been picked up
    event Pickup (
        uint recordId
    );

    // Numismatic coin has been repo'ed for lack of payment
    event Repo (
        uint recordId
    );

    // New numismatic coin has been created
    event Created (
        uint recordId
    );
    
    // Lost or stolen
    event LostOrStolen (
        uint recordId
    );

    mapping(uint => Record) public records; 
    uint public numRecords;

    mapping(uint => string) public warehouses;
    uint public numWarehouses;

    address public owner;

    // Check if the sender is the owner of the numismatic coin
    modifier onlyOwner(uint _recordId) {
       require (records[_recordId].owner == msg.sender);
       _;
    }

    // Check if the master owner of the contract
    modifier onlyMasterOwner {
       require (msg.sender == owner); 
       _;
    } 

    // Initiate the whole numismatic coin contract structure 
    function NumismaticCoin() {
       owner = msg.sender;
    }

    function emptyStr(string str) returns (bool isEmpty) {
       bytes memory tempEmptyStringTest = bytes(str);
       if (tempEmptyStringTest.length == 0) {
          return true;
       } else {
          return false;
       }
    } 

    // Get the master owner of the contract
    function masterOwner() returns (address ownerAddress) {
       return owner;
    }

    // Add a new warehouse to the system
    function addWarehouse(string warehouse) {
       var warehouseId = numWarehouses++;
       warehouses[warehouseId] = warehouse;
    } 
    
    // Transfer control of the master contract
    function transferMaster(address newOwner) onlyMasterOwner {
       owner = newOwner;
    }

    // The storage fee may be raised up to 4% per year.
    function adjustFee(uint _recordId, uint storageFee, uint lateFee) onlyMasterOwner {
       require(lateFee < ((records[_recordId].lateFee*104)/100));
       require(storageFee < ((records[_recordId].storageFee*104)/100));
       if ((lateFee > records[_recordId].lateFee) || (storageFee > records[_recordId].storageFee)) {
           require(records[_recordId].feesLastChanged < (now - (1 years)));
       }
       records[_recordId].feesLastChanged = now;
       records[_recordId].storageFee = storageFee;
       records[_recordId].lateFee = lateFee;
    }

    // Change the owner of a numismatic coin
    function setOwner(uint _recordId, address _newOwner) onlyOwner(_recordId) returns (bool success) {
       var oldOwner = records[_recordId].owner;
       records[_recordId].owner = _newOwner;
       Transfer(_recordId, oldOwner, _newOwner);
       return true;
    }

    // Assign the contract to a name making it non-negotiable. This must be done before the item may be picked up.
    // The item may be picked up after it is assigned
    function setAssignee(uint _recordId, string _assignee) onlyOwner(_recordId) {
       records[_recordId].owner = 0;
       records[_recordId].assignee = _assignee;
       Assignment(_recordId, _assignee);
    }
    
    // This will be called by the warehouse when an item is picked up. Once an item is picked up, storage fees will no longer be due 
    function pickup(uint _recordId) onlyMasterOwner {
       require(!emptyStr(records[_recordId].assignee));
       require(records[_recordId].owner == 0);
       records[_recordId].pickedUp = true;
    }

    // This function can be used to mark items a repo'ed if the storage fees have not been paid
    function repo(uint _recordId) onlyMasterOwner returns(bool success) {
       if((now > (records[_recordId].storagePaidThru + (1 years))) 
           && (!records[_recordId].repoed) 
           && (!records[_recordId].lostOrStolen) 
           && (!records[_recordId].pickedUp)) {
           records[_recordId].repoed = true;
           return true;
       } else {
           return false;
       }
    }

    // Add a new coin to the system
    function addCoin(address initialOwner, string description, string imgUrls, uint warehouse, uint storagePaidThru, uint storageFee, uint lateFee) onlyMasterOwner returns (uint recordId) {
       // We must include at least one week of storage when issuing 
       require(storagePaidThru > (now + (1 weeks)));
       // Add extra check to avoid initially assigning the owner as 0 
       require(initialOwner != 0);

       // Checks to make sure coin is valid 
       require((!emptyStr(description)) && (!emptyStr(imgUrls)) && (storageFee > 0) && (lateFee >= 0));

       recordId = numRecords++;
       
       Record r = records[recordId];
       
       r.owner = initialOwner;
       r.description = description;
       r.imgUrls = imgUrls;
       r.warehouse = warehouse;
       r.storagePaidThru = storagePaidThru;
       r.storageFee = storageFee;
       r.lateFee = lateFee;
       r.feesLastChanged = now;
       Created(recordId);
       return recordId;
    }

    // If the physical item is moved to a new warehouse, this will updated
    function moveWarehouse(uint _recordId, uint warehouse) onlyMasterOwner {
       records[_recordId].warehouse = warehouse;
    }

    // Pay the required storage fee for a coin
    function payStorage(uint _recordId) payable {
       // Don't allow paying additional storage fee if the item is no longer in the warehouse
       require((!records[_recordId].repoed)
          && (!records[_recordId].pickedUp) 
          && (!records[_recordId].lostOrStolen));
       if (records[_recordId].storagePaidThru > now) {
          require((msg.value >= records[_recordId].storageFee) && ((msg.value % records[_recordId].storageFee) == 0));
          records[_recordId].storagePaidThru += (msg.value / records[_recordId].storageFee)*(1 years);
       } else {
          require((msg.value >= (records[_recordId].storageFee + records[_recordId].lateFee)) 
              && ((msg.value - records[_recordId].lateFee)%records[_recordId].storageFee == 0));
          records[_recordId].storagePaidThru += ((msg.value - records[_recordId].lateFee) / records[_recordId].storageFee)*(1 years);
       }
    }
    
    // Determine how much is due
    function getAmountDue(uint _recordId) returns(uint amount) {
       if (records[_recordId].repoed || records[_recordId].pickedUp || records[_recordId].lostOrStolen) {
           return 0;
       } else {
           if (records[_recordId].storagePaidThru > now) {
              return records[_recordId].storageFee;
           } else {
              return (records[_recordId].storageFee + records[_recordId].lateFee);
           }
       }
    }
    
    // Find when the storage is paid thru
    function getStorageFees(uint _recordId) returns(uint storagePaidThru, uint storageFee, uint lateFee) {
       storagePaidThru = records[_recordId].storagePaidThru;
       storageFee = records[_recordId].storageFee;
       lateFee = records[_recordId].lateFee;
    }

    // Allows the owner to withdraw money from the contract
    function withdrawFees(uint _amount) onlyMasterOwner returns(bool success) {
       if (msg.sender.send(_amount)) {
           return true;
       } else {
           return false;
       }
    }
   
    // Report lost or stolen. Insurance should recover reimburse for the item
    function reportLostOrStolen(uint _recordId) onlyMasterOwner {
       records[_recordId].lostOrStolen = true;
       LostOrStolen(_recordId);
    }
}
