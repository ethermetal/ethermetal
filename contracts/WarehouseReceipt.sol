pragma solidity ^0.4.13;

contract NotifyContract {
    function saleNotify(uint recordId, uint price, address from, address to) returns (bool success);
}

contract WarehouseReceipt {
    enum RecordState { inWarehouse, pickedUp, repoed, lostOrStolen }
    struct Record {
        // Who currently owns the item. This will be 0 if it has been assigned
        address owner;
        // Simple description of the item
        string description;
        // If made non-negotiable it must be assigned to an actual person for pickup
        string assignee;
        // URLs for images of item should be on IPFS. Seperated by new line
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
        // State of the item
        RecordState state;
    }

    // Assign a name for pickup
    event Assignment (
        uint recordId,
        string assignee
    );

    // Occurs when item has actually been picked up
    event Pickup (
        uint recordId
    );

    // Numismatic item has been repo'ed for lack of payment
    event Repo (
        uint recordId
    );

    // New item has been added to system
    event Created (
        uint recordId
    );
    
    // Lost or stolen
    event LostOrStolen (
        uint recordId,
        address owner,
        uint payoutInWei
    );
    event Listed (
        uint recordId,
        uint price
    );
    event Unlisted (
        uint recordId
    );
    event ListingSold (
        uint recordId,
        uint price,
        address from,
        address to
    );
    event Transfer (
        uint recordId,
        address from,
        address to
    );
    event StoragePaid (
        uint recordId,
        uint paidThru
    );
    event Withdraw (
        address user,
        uint amount
    );
    event InsuredValueChange (
        uint recordId,
        uint valueInUsdCents
    );

    Record[] public records; 

    mapping(uint => string) public warehouses;
    uint public numWarehouses;

    // Listing of insured value 
    mapping(uint => uint) public insuredValueInUsdCents;

    // Listings of items for sale
    mapping(uint => uint) public listing;

    // Balances for items sold
    mapping(address => uint) public balances;
   
    // These addresses are allowed to receive transfers of contracts from any address or send to contracts of any address
    mapping(address => bool) public authorizedTransferAgents;

    // These address contracts are allowed to own coins.
    mapping(address => bool) public authorizedBuyContracts;


    // Total balance of storage fees
    uint public storageBalance;


    address ownerAddress;
  
    // Callback address for adding affiliate contract 
    address notifyAddress;

    // Check if the sender is the owner of the item
    modifier onlyOwner(uint _recordId) {
       require (records[_recordId].owner == msg.sender);
       _;
    }

    // Check if the master owner of the contract
    modifier onlyMasterOwner {
       require (msg.sender == ownerAddress); 
       _;
    }
     
    // Authorized transfer agents can transfer ownership without selling. This can be used by other contracts. 
    function transfer(uint _recordId, address to) onlyOwner(_recordId) {
       require(authorizedTransferAgents[msg.sender] || authorizedTransferAgents[to]);
       records[_recordId].owner = to;
       Transfer(_recordId, msg.sender, to);
    }

    function changeTransferAuthorization(address agent, bool authorized) onlyMasterOwner {
       authorizedTransferAgents[agent] = authorized;
    } 
    function changeContractBuyAuthorization(address authorizedContract, bool authorized) onlyMasterOwner {
       authorizedBuyContracts[authorizedContract] = authorized;
    }

    function setNotifyAddress(address _notifyAddress) onlyMasterOwner {
       notifyAddress = _notifyAddress;
    } 

    // Initiate the contract
    function WarehouseReceipt() {
       ownerAddress = msg.sender;
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
       return ownerAddress;
    }

    // Add a new warehouse to the system
    function addWarehouse(string warehouse) {
       var warehouseId = numWarehouses++;
       warehouses[warehouseId] = warehouse;
    }
    
    // Transfer control of the master contract
    function transferMaster(address newOwner) onlyMasterOwner {
       ownerAddress = newOwner;
    }

    // The storage fee may be raised up to 4% per year.
    function adjustFee(uint _recordId, uint storageFee, uint lateFee) onlyMasterOwner {
       require(lateFee <= ((records[_recordId].lateFee*104)/100));
       require(storageFee <= ((records[_recordId].storageFee*104)/100));
       if ((lateFee > records[_recordId].lateFee) || (storageFee > records[_recordId].storageFee)) {
           require(records[_recordId].feesLastChanged < (now - (1 years)));
           records[_recordId].feesLastChanged = now;
       }
       records[_recordId].storageFee = storageFee;
       records[_recordId].lateFee = lateFee;
    }
    
    // List an item
    function list(uint _recordId, uint price) onlyOwner(_recordId) {
       require(records[_recordId].state == RecordState.inWarehouse); 
       listing[_recordId] = price;
       Listed(_recordId, price);

    }

    // Un-list an item
    function unlist(uint _recordId) onlyOwner(_recordId) {
       require(listing[_recordId] != 0);
       listing[_recordId] = 0;
       Unlisted(_recordId);
    }

    // See if the address is a contract
    function isContract(address addr) returns (bool) {
       uint size;
       assembly { size := extcodesize(addr) }
       return size > 0;
    }

    // Buy a listed item
    function buy(uint _recordId) payable {
       // Only authorized contracts are allowed to buy
       require(!isContract(msg.sender) || authorizedBuyContracts[msg.sender]);
       require(listing[_recordId] > 0);
       require(listing[_recordId] == msg.value);
       require(records[_recordId].owner != 0 && records[_recordId].state == RecordState.inWarehouse );
       listing[_recordId] = 0;
       var oldOwner = records[_recordId].owner;
       records[_recordId].owner = msg.sender;
       // Seller could potentially be a contract, which fails here preventing a sale.
       balances[oldOwner] += msg.value;
       ListingSold(_recordId, msg.value, oldOwner, msg.sender);
       if (notifyAddress != 0x0) {
           NotifyContract notifyContract = NotifyContract(notifyAddress);
           require(notifyContract.saleNotify(_recordId, msg.value, oldOwner, msg.sender));
       }
    }
   
    // Withdraw balance for items sold
    function withdraw() {
       require(balances[msg.sender] > 0);
       var withdrawal = balances[msg.sender];
       balances[msg.sender] = 0;
       msg.sender.transfer(withdrawal);
       Withdraw(msg.sender, withdrawal);
    } 

    // Assign the contract to a name making it non-negotiable. This must be done before the item may be picked up.
    // The item may be picked up after it is assigned
    function assign(uint _recordId, string _assignee) onlyOwner(_recordId) {
       require(!emptyStr(_assignee));
       require(listing[_recordId] == 0 && records[_recordId].state == RecordState.inWarehouse);
       require(emptyStr(records[_recordId].assignee));
       records[_recordId].owner = 0;
       records[_recordId].assignee = _assignee;
       Assignment(_recordId, _assignee);
    }
    
    // This will be called by the warehouse when an item is picked up. Once an item is picked up, storage fees will no longer be due 
    function pickup(uint _recordId) onlyMasterOwner {
       require(!emptyStr(records[_recordId].assignee));
       require(records[_recordId].owner == 0);
       listing[_recordId] = 0;

       records[_recordId].state = RecordState.pickedUp;
       Pickup(_recordId);
    }

    // This function can be used to mark items a repo'ed if the storage fees have not been paid
    function repo(uint _recordId) onlyMasterOwner returns(bool success) {
       if((now > (records[_recordId].storagePaidThru + (1 years))) 
           && records[_recordId].state == RecordState.inWarehouse)  {
           listing[_recordId] = 0; 
           records[_recordId].state = RecordState.repoed;
           Repo(_recordId);
           return true;
       } else {
           return false;
       }
    }

    // Add a new item to the system
    function addItem(address initialOwner, string description, string imgUrls, uint warehouse, uint storagePaidThru, uint storageFee, uint lateFee) onlyMasterOwner returns (uint recordId) {
       // We must include at least one week of storage when issuing 
       require(storagePaidThru > (now + (1 weeks)));
       // Add extra check to avoid initially assigning the owner as 0 
       require(initialOwner != 0);

       // Checks to make sure item is valid 
       require((!emptyStr(description)) && (!emptyStr(imgUrls)) && (storageFee > 0) && (lateFee >= 0));

       records.push(Record(initialOwner, description, "", imgUrls, warehouse, now, storagePaidThru, storageFee, lateFee,  RecordState.inWarehouse));
       recordId = records.length - 1;

       Created(recordId);
    }

    // If the physical item is moved to a new warehouse, this will updated
    function moveWarehouse(uint _recordId, uint warehouse) onlyMasterOwner {
       records[_recordId].warehouse = warehouse;
    }

    // Pay the required storage fee for an item
    function payStorage(uint _recordId) payable {
       // Don't allow paying additional storage fee if the item is no longer in the warehouse
       require(records[_recordId].state == RecordState.inWarehouse);
       if (records[_recordId].storagePaidThru > now) {
          require((msg.value >= records[_recordId].storageFee) && ((msg.value % records[_recordId].storageFee) == 0));
          records[_recordId].storagePaidThru += (msg.value / records[_recordId].storageFee)*(1 years);
       } else {
          require((msg.value >= (records[_recordId].storageFee + records[_recordId].lateFee)) 
              && ((msg.value - records[_recordId].lateFee)%records[_recordId].storageFee == 0));
          records[_recordId].storagePaidThru += ((msg.value - records[_recordId].lateFee) / records[_recordId].storageFee)*(1 years);
       }
       storageBalance += msg.value;
       StoragePaid(_recordId, records[_recordId].storagePaidThru);
    }
    
    // Determine how much is due
    function getAmountDue(uint _recordId) returns(uint amount) {
       if (records[_recordId].state != RecordState.inWarehouse) { 
           return 0;
       } else {
           if (records[_recordId].storagePaidThru > now) {
              return records[_recordId].storageFee;
           } else {
              return (records[_recordId].storageFee + records[_recordId].lateFee);
           }
       }
    }
    
    // Allows the owner to withdraw money from the contract
    function withdrawFees(uint _amount) onlyMasterOwner {
       require(storageBalance >= _amount);
       storageBalance -= _amount;
       require (msg.sender.send(_amount));
    }
   
    // Report lost or stolen. Insurance should recover reimburse for the item
    function reportLostOrStolen(uint _recordId) payable onlyMasterOwner {
       require(records[_recordId].owner != 0 && records[_recordId].state == RecordState.inWarehouse);
       records[_recordId].state = RecordState.lostOrStolen;
       listing[_recordId] = 0;
       address formerOwner = records[_recordId].owner;
       records[_recordId].owner = 0;
       formerOwner.transfer(msg.value);

       LostOrStolen(_recordId, formerOwner, msg.value);
    }

    // Get information about a record
    function getRecord(uint recordId) returns(address _owner, string _description, string _assignee, string _imgUrls, string _warehouse, uint _feesLastChanged, uint _storagePaidThru, uint _storageFee, uint _lateFee, RecordState _state, uint _price) {
       _owner = records[recordId].owner;
       _description = records[recordId].description;
       _assignee = records[recordId].assignee;
       _imgUrls = records[recordId].imgUrls;
       _warehouse = warehouses[records[recordId].warehouse];
       _feesLastChanged = records[recordId].feesLastChanged;
       _storagePaidThru = records[recordId].storagePaidThru;
       _storageFee = records[recordId].storageFee;
       _lateFee = records[recordId].lateFee;
       _state = records[recordId].state;
       _price = listing[recordId];
    }
    
    // Set insured value for an item
    function setInsuredValue(uint recordId, uint usdCents) onlyMasterOwner { 
       insuredValueInUsdCents[recordId] = usdCents;
       InsuredValueChange(recordId, usdCents);
    }
    
}
