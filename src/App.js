import React, { Component } from 'react'
import WarehouseReceiptContract from '../build/contracts/WarehouseReceipt.json'
import getWeb3 from './utils/getWeb3'
import Coin from './components/Coin'
import FetchCoin from './components/FetchCoin'
import DataProxy from './DataProxy'
import AccountSelector from './components/AccountSelector';

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
      noWallet: false

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
  }
  onFetch(id) {
      this.state.dp.getCoin(id).then( (coinInfo) => {
          coinInfo['hidden'] = false;
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
               queue.push(item.args.recordId.toNumber() + ' sold for ' + th.state.web3.fromWei(item.args.price,'ether') + ' ether');
            } else if(type == 'Listed') {
               queue.push(item.args.recordId.toNumber() + ' listed for ' + th.state.web3.fromWei(item.args.price,'ether') + ' ether');
            } else if(type == 'Unlisted') {
               queue.push(item.args.recordId.toNumber() + ' unlisted');
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
  }

  render() {
    var buy = '';
    if (this.state.listingPrice) {
      buy = <button className="pure-button pure-button-purchase" onClick={this._onBuy}>Buy for {this.state.web3.fromWei(this.state.listingPrice,'ether')} Ether</button>;
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
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">EtherMetal</a>
            <FetchCoin onFetch={this.onFetch} />
            <div className="navbar-right pure-form account pure-u-1-3">
              {positiveNotification}
              {negativeNotification}
              <label>Your Account</label>
              <AccountSelector ref="as" onChangeAccount={this.onChangeAccount} accounts={this.state.accounts} />
              <button onClick={this.onWithdraw}>Withdraw</button>
              <div className="account__buy-button">
                {buy}
              </div>
            </div>
        </nav>
        <h2>TEST MODE</h2>
        <nav className="navbar-secondary">
          <ul>
            <li><a href="#/coin/0" key="coin_0" onClick={this.onChangeCoin}>First coin</a></li>
          </ul>
        </nav>
        
        <main className="container">
           <Coin ref="coin1" onChangeAccount={this.onChangeAccount} onList={this.onList} onUnlist={this.onUnlist} onAssign={this.onAssign} onBuy={this.onBuy} onPayStorage={this.onPayStorage} onWithdraw={this.onWithdraw} name="coin1" />
        </main>

        <footer>
          <ul>
            <li>
              <a href="#" className="pure-menu-heading pure-menu-link">About us</a>
            </li>
            <li>
              <a href="#" className="pure-menu-heading pure-menu-link">Team</a>
            </li>
          </ul>
          <p>EtherMetal is a product of Cherbi Group LLC of California.</p>
        </footer>

      </div>
    );
  }
}

export default App
