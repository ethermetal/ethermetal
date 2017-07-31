
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
       return this.contract.records.call(parseInt(coinId)).then(function(coin) {
           return {'owner':coin[0], 'description':coin[1], 'assignee':coin[2], 'imgUrls':coin[3].split("\n"), 
                   'warehouse':coin[4].c[0], 'feesLastChanged':coin[5].c[0], 'storagePaidThru':coin[6].c[0],'storageFee':coin[7].c[0],
                   'lateFee':coin[8].c[0], 'pickedUp':coin[9], 'repoed':coin[10], 'lostOrStolen':coin[11]};
       });
       //return(coins[coinId]);
    }
    
    // Create a new warehouse receipt of the coin
    addCoin(description, images, warehouse, storagePaidThru, storageFee, lateFee) {
        coins.append({'description':description, 'assignee':null, 'images':images, 'warehouse':warehouse, 'storagePaidThru':storagePaidThru, 'storageFee':storageFee, 'lateFee':lateFee});
        return(coins.length - 1);
    }
}

export default DataProxy;

