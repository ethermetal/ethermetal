import React, { Component } from 'react';
import formatTs from '../TimeFormat';

class PriceHistory extends Component {
   constructor(props) {
      super(props);
      this.state = {'history':[]};
      this.onFetchHistory = this.onFetchHistory.bind(this);
   }

   onFetchHistory() {
      var th = this;
      this.props.onFetchHistory(function(history) {
          th.setState({'history':history});
      });
   }

   render() {
      var historyEntries = [];
      for(var i=0; i < this.state.history.length; i++) {
          var date = formatTs(this.state.history[i].date);
          var key = "history_" + i;
          var fromLink = "https://etherscan.io/address/" + this.state.history[i].from;
          var from = <a target="_blank" href={fromLink}>{this.state.history[i].from.substr(0,8)}</a>;
          var toLink = "https://etherscan.io/address/" + this.state.history[i].to;
          var to = <a target="_blank" href={toLink}>{this.state.history[i].to.substr(0,8)}</a>;
          var price = this.state.history[i].price.toNumber();
          historyEntries.push(<tr key={key}><td>{date}</td><td>{price} Ether</td><td>{from}</td><td>{to}</td></tr>);
      }
      var history = '';
      if (historyEntries.length > 0) {
          history = <table className="history"><thead><tr><td>Date</td><td>Price</td><td>Seller</td><td>Buyer</td></tr></thead><tbody>{historyEntries}</tbody></table>;
      }
      return (<div><div><button className="pure-button pure-button-primary" onClick={this.onFetchHistory}>Fetch Price History</button></div>{history}</div>);
   }
}

export default PriceHistory;
