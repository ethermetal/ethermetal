
var coins = {'0': {'owner': '0x284232',
 'description': '1837 $5 Gold Piece AU 55 Graded & Certified by PCGS',
 'assignee': null,
 'images': ['http://localhost/data/coin/0','http://localhost/data/coin/1'],
 'warehouse': 'Alex & Sons',
 'feeLastChanged': 1501172133210,
 'storagePaidThru': 1532708133210,
 'storageFee': 1e18, //1ether = 1e18 wei
 'lateFee': 5e17,
 'pickedUp': false,
 'repoed': false,
 'lostOrStolen': false}
}

class DataProxy {
    constructor(contract) {
       this.contract = contract; 
    }
    
    // Get a coin by id 
    getCoin(coinId) {
       return this.contract.getRecord.call(parseInt(coinId)).then(function(coin) {
           return {'coinId':coinId, 'owner':coin[0], 'description':coin[1], 'assignee':coin[2], 'imgUrls':coin[3].split("\n"), 
                   'warehouse':coin[4], 'feesLastChanged':coin[5].c[0], 'storagePaidThru':coin[6].c[0],'storageFee':coin[7].c[0],
                   'lateFee':coin[8].c[0], 'pickedUp':coin[9].c[0] == 1, 'repoed':coin[9].c[0] == 2, 'lostOrStolen':coin[9].c[0] == 3, 'listingPrice':coin[10].c[0]};
       });
       //return(coins[coinId]);
    }

    // List a coin
    list(coinId, price) {
        return this.contract.list(parseInt(coinId), price);
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

    // Create a new warehouse receipt of the coin
    addCoin(description, images, warehouse, storagePaidThru, storageFee, lateFee) {
        coins.append({'description':description, 'assignee':null, 'images':images, 'warehouse':warehouse, 'storagePaidThru':storagePaidThru, 'storageFee':storageFee, 'lateFee':lateFee});
        return(coins.length - 1);
    }
    buy(coinId, price) {
        return this.contract.buy(coinId, {value:price});
    }
    assign(coinId, assignee) {
        return this.contract.assign(assignee);
    }
    withdraw() {
        return this.contract.withdraw();
    }
    payStorage(coinId, value) {
        console.log("Paying storage " + value);
        return this.contract.payStorage(coinId, {value:value});
    }
}

export default DataProxy;

