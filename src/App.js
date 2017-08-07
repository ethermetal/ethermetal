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
      listingPrice: null
    }
    this.onFetch = this.onFetch.bind(this);
    this.onList = this.onList.bind(this);
    this.onAssign = this.onAssign.bind(this);
    this.onBuy = this.onBuy.bind(this);
    this._onBuy = this._onBuy.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.onPayStorage = this.onPayStorage.bind(this);
    this.onChangeAccount = this.onChangeAccount.bind(this);
  }
  onFetch(id) {
      this.state.dp.getCoin(id).then( (coinInfo) => {
          coinInfo['hidden'] = false;
          this.refs.coin1.setState(coinInfo);
          this.setState({'listingPrice': coinInfo['listingPrice'] });
          this.setState({'coinId': coinInfo['coinId'] });
      });
  }
  onAssign(coinId, assignee) {
      this.state.dp.assign(coinId, assignee);
  }
  onList(coinId, price) {
      this.state.dp.list(coinId, price);
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
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({'accounts':accounts});
      warehouseReceipt.web3.eth.defaultAccount = accounts[0];
      warehouseReceipt.deployed().then((instance) => {
        th.setState({'dp':new DataProxy(instance)});
      });
    });
  }

  onChangeAccount(account) {
    this.state.web3.eth.defaultAccount = account;
  }

  render() {
    var buy = '';
    if (this.state.listingPrice) {
      buy = <button className="pure-button pure-button-purchase" onClick={this._onBuy}>Buy for {this.state.listingPrice} Wei</button>;
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Cherbizon</a>
            <FetchCoin onFetch={this.onFetch} />
            <div className="navbar-right pure-form account pure-u-1-3">
              <p className="notification positive hidden">Sample notification. Add class hidden to hide.</p>
              <p className="notification negative hidden">Sample notification. Add class hidden to hide.</p>
              <label>Your Account</label>
              <AccountSelector ref="as" onChangeAccount={this.onChangeAccount} accounts={this.state.accounts} />
              <button onClick={this.onWithdraw}>Withdraw</button>
              <div className="account__buy-button">
                {buy}
              </div>
            </div>
        </nav>
        <nav className="navbar-secondary">
          <ul>
            <li><a href="#">Sample coin 123456</a></li>
            <li><a href="#">Buffalo nickel 98766</a></li>
            <li><a href="#">Susan B. Anthony 456789</a></li>
          </ul>
        </nav>
        
        <main className="container">
           <Coin ref="coin1" onChangeAccount={this.onChangeAccount} onList={this.onList} onAssign={this.onAssign} onBuy={this.onBuy} onPayStorage={this.onPayStorage} onWithdraw={this.onWithdraw} name="coin1" />
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
        </footer>

      </div>
    );
  }
}

export default App
