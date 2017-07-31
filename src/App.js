import React, { Component } from 'react'
import NumismaticCoinContract from '../build/contracts/NumismaticCoin.json'
import getWeb3 from './utils/getWeb3'
import Coin from './components/Coin'
import FetchCoin from './components/FetchCoin'
import DataProxy from './DataProxy' 

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
      dp: null
    }
    this.onFetch = this.onFetch.bind(this);
  }
  onFetch(id) {
      this.state.dp.getCoin(id).then( (coinInfo) => {
          this.refs.coin1.setState(coinInfo);
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

  instantiateContract() {
    /*
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const numismaticCoin = contract(NumismaticCoinContract)
    numismaticCoin.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on numisMaticCoin
    var th = this;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      numismaticCoin.web3.eth.defaultAccount = accounts[0];
      numismaticCoin.deployed().then((instance) => {
        th.setState({'dp':new DataProxy(instance)});
      });
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Cherbizon</a>
        </nav>

        <main className="container">
           <FetchCoin onFetch={this.onFetch} />
           <Coin ref="coin1" name="coin1" />
        </main>
      </div>
    );
  }
}

export default App
