
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
    }
    
    // Get a coin by id 
    getCoin(coinId) {
       return this.contract.getRecord.call(parseInt(coinId)).then(function(coin) {
           return {'coinId':coinId, 'owner':coin[0], 'description':coin[1], 'assignee':coin[2], 'imgUrls':coin[3].split("\n"), 
                   'warehouse':coin[4], 'feesLastChanged':coin[5].toNumber(), 'storagePaidThru':coin[6].toNumber(),'storageFee':coin[7].toNumber(),
                   'lateFee':coin[8].toNumber(), 'pickedUp':coin[9].toNumber() == 1, 'repoed':coin[9].toNumber() == 2, 'lostOrStolen':coin[9].toNumber() == 3, 'listingPrice':coin[10].toNumber()};
       });
       //return(coins[coinId]);
    }

    // List a coin
    list(coinId, price) {
        return this.contract.list(parseInt(coinId), parseInt(price));
    }
    unlist(coinId) {
        return this.contract.unlist(parseInt(coinId));
    }
    feature(coinId) {
        this.contract.featured.call().then(function(featured) {
            if(featured.indexOf(coinId) == -1) {
              featured.append(coinId);
              this.contract.feature(featured);
            }
        });
    }
    getFeatured() {
        return this.contract.featured.call();
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
        this.contract.ListingSold({'recordId':coinId}, {fromBlock:0, toBlock: 'latest'}).get(function(error, logs) {
           console.log(logs);
        });
      
    }
}

export default DataProxy;

