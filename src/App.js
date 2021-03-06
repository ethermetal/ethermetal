import React, { Component } from 'react'
import WarehouseReceiptContract from '../build/contracts/WarehouseReceipt.json'
import getWeb3 from './utils/getWeb3'
import Coin from './components/Coin'
import FetchCoin from './components/FetchCoin'
import DataProxy from './DataProxy'
import AccountSelector from './components/AccountSelector';
import Gitter from 'react-sidecar';
import Fineprint from './components/Fineprint';
import formatTs from './TimeFormat';
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      dp: null,
      accounts: [],
      listingPrice: null,
      coinId: null,
      noWallet: false,
      balance: null

    }
    this.onFetch = this.onFetch.bind(this);
    this.onList = this.onList.bind(this);
    this.onUnlist = this.onUnlist.bind(this);
    this.onAssign = this.onAssign.bind(this);
    this.onBuy = this.onBuy.bind(this);
    this._onBuy = this._onBuy.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.onPayStorage = this.onPayStorage.bind(this);
    this.onChangeAccount = this.onChangeAccount.bind(this);
    this.onChangeCoin = this.onChangeCoin.bind(this);
    this.onShowInsuredAmount = this.onShowInsuredAmount.bind(this);
    this.onFetchHistory = this.onFetchHistory.bind(this);
  }
  onFetchHistory(coinId, cb) {
      this.state.dp.getPriceHistory(coinId, cb);
  }
  
  onFetch(id) {
      this.state.dp.getCoin(id).then( (coinInfo) => {
          coinInfo['hidden'] = false;
          coinInfo['account'] = this.state.web3.eth.defaultAccount;
          this.refs.coin1.setState(coinInfo);
          this.setState({'listingPrice': coinInfo['listingPrice'], 'coinId': coinInfo['coinId'] });
          location.hash = "#/coin/" + id;
      });
  }
  onAssign(coinId, assignee) {
      this.state.dp.assign(coinId, assignee);
  }
  onList(coinId, price) {
      this.state.dp.list(coinId, price);
  }
  onUnlist(coinId) {
      this.state.dp.unlist(coinId);
  }
  onChangeCoin(event) {
      var m = event.target.hash.match(/#\/coin\/(\d+)/);
      return this.onFetch(m[1]);
  }
  onShowInsuredAmount(coinId) {
      this.state.dp.getInsuredValue(coinId).then(function(val) {
          alert("Coin " + coinId + " is insured for " + (val/100.0) + " US dollars");
      });
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
  onBuy(coinId, price) {
     this.state.dp.buy(coinId, price)
  }
  _onBuy(event) {
     this.onBuy(this.state.coinId, this.state.listingPrice);
  }
  onWithdraw() {
     this.state.dp.withdraw();
  }
  onPayStorage(coinId, fee) {
     this.state.dp.payStorage(coinId,fee);
  }

  instantiateContract() {
    /*
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const warehouseReceipt = contract(WarehouseReceiptContract)
    warehouseReceipt.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on warehouseReceipt
    var th = this;
    // Get accounts.
    this.state.web3.version.getNetwork((err, netId) => {
      switch (netId) {
          case "1":
              alert("Main network not yet supported. Please use test network");
              this.setState({'disable':true});
              break;
          case "2":
              break;
          case "3":
              break;
          defaut:
              break
      } 
    });
    this.state.web3.eth.getAccounts((error, accounts) => {
      if(error !== null) {
          this.setState({'noWallet':true});
          return;
      }
      this.setState({'accounts':accounts});
      warehouseReceipt.web3.eth.defaultAccount = accounts[0];
      warehouseReceipt.deployed().then((instance) => {
        var dp = new DataProxy(instance, warehouseReceipt.web3);
        th.setState({'dp':dp});
        th.updateBalance();
        var defaultPage = 0;
        var m = location.hash.match(/#\/coin\/(\d+)/);
        if (m) {
            th.onFetch(m[1]);
        } else {
            th.onFetch(0);
        }
        var queue = []
        dp.listen(function(error, item, type) {
            if (type == 'ListingSold') {
               queue.push('Item ' + item.args.recordId.toNumber() + ' sold for ' + th.state.web3.fromWei(item.args.price,'ether') + ' ether');
            } else if(type == 'Listed') {
               queue.push('Item ' + item.args.recordId.toNumber() + ' listed for ' + th.state.web3.fromWei(item.args.price,'ether') + ' ether');
            } else if(type == 'Unlisted') {
               queue.push('Item ' + item.args.recordId.toNumber() + ' unlisted');
            } else if(type == 'Assignment') {
               queue.push('Item ' + item.args.recordId.toNumber() + ' assigned to ' + item.args.assignee.toString());
            } else if(type == 'StoragePaid') {
               queue.push('Item ' + item.args.recordId.toNumber() + ' storage paid thru ' + formatTs(item.args.paidThru) );
            } else if(type == 'Withdraw') {
               queue.push(item.args.user + ' has withdrawn ' + th.state.web3.fromWei(item.args.amount,'ether') + ' ether');
               this.updateBalance();
            }
        });
        setInterval(function() {
            if (queue.length == 0) {
                return true;
            }
            
            while (queue.length > 10) {
                queue.pop();
            }
            th.setState({'positiveNotification': queue.pop()});
            th.onFetch(th.state.coinId);

            return true;
        }, 500);
      });
    });
  }

  onChangeAccount(account) {
    this.state.web3.eth.defaultAccount = account;
    this.refs.coin1.setState({'account':account});
    this.updateBalance();
  }
  updateBalance() {
    if (this.state.dp !== null) {
        var th = this;
        this.state.dp.getBalance(this.state.web3.eth.defaultAccount).then(function(bal) {
            if (th.state.balance == null || th.state.balance.toNumber() != bal.toNumber()) {
               th.setState({'balance':bal});
            }
        });

    }
  }

  render() {
    var buy = '';
    var th = this;
    this.updateBalance();
    if (this.state.listingPrice) {
      buy = <div className="account__buy-button"><button className="pure-button pure-button-purchase" onClick={this._onBuy}>Buy for {this.state.web3.fromWei(this.state.listingPrice,'ether')} Ether</button>                 <p className="fineprint">Purchase subject to terms below.</p></div> ;
    }
    var positiveNotification = "";
    if (this.state.positiveNotification) {
        positiveNotification = <p className="notification positive">{this.state.positiveNotification}</p>;
    }
    var negativeNotification = "";
    if (this.state.negativeNotification) {
        negativeNotification = <p className="notification negative">{this.state.negativeNotification}</p>;
    }
    if (this.state.noWallet) {
        return(<p>An Ethereum wallet is required. Please download <a href="https://metamask.io/">Metamask</a>.</p>);
    }
    var withdraw = "";
    if (this.state.balance != null && this.state.balance > 0) {
       var bal = th.state.web3.fromWei(this.state.balance, 'ether').toNumber();
       withdraw = <div><span className="balanceText">Balance from items sold: {bal} ether</span><button onClick={this.onWithdraw}>Withdraw Balance</button></div>;
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">EtherMetal</a>
            <FetchCoin onFetch={this.onFetch} />
            <div className="navbar-right pure-form account pure-u-1-3">
              {positiveNotification}
              {negativeNotification}
              <label>Your Account</label>
              <AccountSelector ref="accountSelector" onChangeAccount={this.onChangeAccount} accounts={this.state.accounts} />
              {withdraw}
              {buy}
            </div>
        </nav>
        <h2>TEST MODE</h2>
        <nav className="navbar-secondary">
          <ul>
            <li><a href="#/coin/0" key="coin_0" onClick={this.onChangeCoin}>1837 $5 US Gold Piece AU 55</a></li>
            <li><a href="#/coin/1" key="coin_1" onClick={this.onChangeCoin}>1812 Capped Bust Half Dollar XF40</a></li>
            <li><a href="#/coin/2" key="coin_2" onClick={this.onChangeCoin}>1938-D Buffalo Nickel MS 66+</a></li>
            <li><a href="#/coin/3" key="coin_3" onClick={this.onChangeCoin}>1946 BTW Commemorative Half Dollar MS 66</a></li>
            <li><a href="#/coin/4" key="coin_4" onClick={this.onChangeCoin}>1913-S Buffalo Nickel Type 2 AU 55</a></li>
            <li><a href="#/coin/5" key="coin_5" onClick={this.onChangeCoin}>1913-D Buffalo Nickel Type 2 XF 40</a></li>
            <li><a href="#/coin/6" key="coin_6" onClick={this.onChangeCoin}>1948 Franklin Half Dollar MS 64 FBL</a></li>

          </ul>
        </nav>
        
        <main className="container">
           <Coin ref="coin1" onChangeAccount={this.onChangeAccount} onList={this.onList} onUnlist={this.onUnlist} onAssign={this.onAssign} onBuy={this.onBuy} onPayStorage={this.onPayStorage} onWithdraw={this.onWithdraw} onShowInsuredAmount={this.onShowInsuredAmount} onFetchHistory={this.onFetchHistory} name="coin1" />

        </main>

        <footer>
          <ul className="hidden">
            <li>
              <a href="#" className="pure-menu-heading pure-menu-link">About us</a>
            </li>
            <li>
              <a href="#" className="pure-menu-heading pure-menu-link">Team</a>
            </li>
          </ul>
          <p>EtherMetal is a product of Cherbi Group LLC of California.<br/> <a href="https://github.com/ethermetal/ethermetal">Ethermetal Code on Github</a></p>
        </footer>

      </div>
    );
  }
}

export default App
