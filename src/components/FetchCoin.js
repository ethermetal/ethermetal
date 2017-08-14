import React, { Component } from 'react';

class FetchCoin extends Component {
   constructor(props) {
     super(props);
     this.state = {
        'coinId': ''
     };

     this.changeCoinId = this.changeCoinId.bind(this);
     this.onFetch = this.onFetch.bind(this);
   }

   changeCoinId(event) {
      this.setState({'coinId':event['target'].value});
   }

   onFetch(event) {
      this.props.onFetch(this.state.coinId);
   }

   render() {
      return(<div className="fetchCoin pure-form">
             <label className="nav-link">Find item by:</label>
             <input type="text" placeholder="id" name="coinId" onChange={this.changeCoinId}/>
             <button onClick={this.onFetch} className="pure-button pure-button-primary">Go</button>
             </div>);
   }
}

export default FetchCoin
