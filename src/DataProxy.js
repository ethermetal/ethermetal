
class DataProxy {
    constructor(contract, web3) {
       this.contract = contract; 
       this.web3 = web3;
    }
    listen(cb) {
       this.contract.ListingSold({}, {'fromBlock':'latest'}).watch(function(error, result) {
           cb(error, result, 'ListingSold');
       });
       this.contract.Listed({}, {'fromBlock':'latest'}).watch(function(error, result) {
           cb(error, result, 'Listed');
       });
       this.contract.Unlisted({}, {'fromBlock':'latest'}).watch(function(error, result) {
           cb(error, result, 'Unlisted');
       });
       this.contract.Assignment({}, {'fromBlock':'latest'}).watch(function(error, result) {
           cb(error, result, 'Assignment');
       });
       this.contract.StoragePaid({}, {'fromBlock':'latest'}).watch(function(error, result) {
           cb(error, result, 'StoragePaid');
       });
       this.contract.Withdraw({}, {'fromBlock':'latest'}).watch(function(error, result) {
           cb(error, result, 'Withdraw');
       });
    }
    
    // Get a coin by id 
    getCoin(coinId) {
       return this.contract.getRecord.call(parseInt(coinId)).then(function(coin) {
           return {'coinId':coinId, 'owner':coin[0], 'description':coin[1], 'assignee':coin[2], 'imgUrls':coin[3].split("\n"), 
                   'warehouse':coin[4], 'feesLastChanged':coin[5].toNumber(), 'storagePaidThru':coin[6].toNumber(),'storageFee':coin[7].toNumber(),
                   'lateFee':coin[8].toNumber(), 'pickedUp':coin[9].toNumber() == 1, 'repoed':coin[9].toNumber() == 2, 'lostOrStolen':coin[9].toNumber() == 3, 'listingPrice':coin[10].toNumber()};
       });
    }

    // List a coin
    list(coinId, price) {
        return this.contract.list(parseInt(coinId), parseInt(price));
    }
    unlist(coinId) {
        return this.contract.unlist(parseInt(coinId));
    }
    buy(coinId, price) {
        return this.contract.buy(parseInt(coinId), {value:price});
    }
    assign(coinId, assignee) {
        return this.contract.assign(parseInt(coinId), assignee);
    }
    withdraw() {
        return this.contract.withdraw();
    }
    payStorage(coinId, value) {
        console.log("Paying storage " + value);
        return this.contract.payStorage(coinId, {value:value});
    }
    getPriceHistory(coinId, cb) {
        var history = [];
        var web3 = this.web3;
        this.contract.ListingSold({'recordId':coinId}, {fromBlock:0, toBlock: 'latest'}).get(function(error, logs) {
           var i = 0;
           var j = 0;
           var batch = web3.createBatch()

           for(var i=0;i < logs.length;i++) {
              batch.add(web3.eth.getBlock(logs[i].blockNumber, function(error, result) {
                var log = logs[j];

                if (!error) {
                  var hist = {'date': result.timestamp, 'from':logs[j].args.from, 'to':logs[j].args.to, 'price':web3.fromWei(logs[j].args.price,'ether'), 'recordId':logs[j].args.recordId.toNumber()};
                  history.push(hist);
                }
                j++;
                if (j == logs.length) {
                  cb(history);
                }
              }));
           }
           batch.execute();
        });
      
    }
    getInsuredValue(coinId) {
        return this.contract.insuredValueInUsdCents.call(parseInt(coinId));
    }
    getBalance(user) {
        return this.contract.balances.call(user);  
    }
}

export default DataProxy;
