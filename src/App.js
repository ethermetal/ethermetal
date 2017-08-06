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
      accounts: []
    }
    this.onFetch = this.onFetch.bind(this);
    this.onList = this.onList.bind(this);
    this.onAssign = this.onAssign.bind(this);
    this.onBuy = this.onBuy.bind(this);
    this.onWithdraw = this.onWithdraw.bind(this);
    this.onPayStorage = this.onPayStorage.bind(this);
    this.onChangeAccount = this.onChangeAccount.bind(this);
  }
  onFetch(id) {
      this.state.dp.getCoin(id).then( (coinInfo) => {
          coinInfo['hidden'] = false;
          this.refs.coin1.setState(coinInfo);
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
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Cherbizon</a>
            <div className="navbar-right pure-form account">
              <label>Your Account</label>
              <AccountSelector ref="as" onChangeAccount={this.onChangeAccount} accounts={this.state.accounts} />
              <button onClick={this.onWithdraw}>Withdraw</button>
            </div>
            <div className="clearfix"></div>
        </nav>

        <main className="container">
           <FetchCoin onFetch={this.onFetch} />
           <Coin ref="coin1" onChangeAccount={this.onChangeAccount} onList={this.onList} onAssign={this.onAssign} onBuy={this.onBuy} onPayStorage={this.onPayStorage} onWithdraw={this.onWithdraw} name="coin1" />
        </main>
      </div>
    );
  }
}

export default App
