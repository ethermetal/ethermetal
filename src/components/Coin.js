import React, { Component } from 'react';
import List from './List';
import Assign from './Assign';
import web3 from 'web3';
import Fineprint from './Fineprint';
import formatTs from '../TimeFormat';
import PriceHistory from './PriceHistory';

class Coin extends Component {
  constructor(props) {
    super(props);
    this.state = {'coinId':-1,'description':'', 'storagePaidThru':0, 'storageFee':0, 'lateFee':0, 'feesLastChanged':0, 'imgUrls':[], 'listable':true, 'listingPrice':0, 'storageFeeToPay':0, 'numStorageYears':0, 'assignee':'', hidden:true, storageError:'', account:''};
    this.onList = this.onList.bind(this);

    this.onAssign = this.onAssign.bind(this);
    this.onBuy = this.onBuy.bind(this);
    this.onPayStorage = this.onPayStorage.bind(this);
    this.onChangeNumYears = this.onChangeNumYears.bind(this);
    this.onUnlist = this.onUnlist.bind(this);
    this.onShowInsuredAmount = this.onShowInsuredAmount.bind(this);
    this.onFetchHistory = this.onFetchHistory.bind(this);
  }
  onFetchHistory(cb) {
     this.props.onFetchHistory(this.state.coinId, cb);
  }
  onShowInsuredAmount() {
     this.props.onShowInsuredAmount(this.state.coinId);
  }
  onList(price) {
     this.props.onList(this.state.coinId, price);
  }
  onUnlist() {
     this.props.onUnlist(this.state.coinId);
  }
  onAssign(assignee) {
     this.props.onAssign(this.state.coinId, assignee);
  }
  onBuy(event) {
     this.props.onBuy(this.state.coinId, this.state.listingPrice);
  }
  onPayStorage(event) {
      if(this.state.numStorageYears == 0 || this.state.numStorageYears % 1 != 0) {
          this.setState({'storageError':'You must enter the number of year, that you wish to purchase storage for'});
          return;
      }
      var fee = 0;
      if(Date.now() > this.state.storagePaidThru*1000) {
         fee += this.state.lateFee;
      }
      fee += parseInt(this.state.numStorageYears)*this.state.storageFee;
      this.props.onPayStorage(this.state.coinId, fee);
      this.setState({'numStorageYears':0});
      
  }
  onChangeNumYears(event) {
      this.setState({'numStorageYears':parseInt(event.target.value)});
  }

  render() {
    if (this.state.hidden) {
        return <div/>;
    }
    var listable = "";
    if (this.state.listable && this.state.owner === this.state.account) {
        listable = <fieldset><List onList={this.onList} onUnlist={this.onUnlist} listed={(this.state.listingPrice==0)}/></fieldset>;
    }
    var buy = ""
    if (this.state.listingPrice != 0) {
        buy = <button className="pure-button pure-button-purchase" onClick={this.onBuy}>Buy for {(this.state.listingPrice/1e18)} Ether</button>;
    }
    var imgs = [];
    var n =0;
    this.state.imgUrls.forEach((imgSrc) => {
       imgs.push(<img src={imgSrc} key={"img_" + n} className="pure-img" />);
       n++;
    });

    var assigneeLabel = "";
    var assignee = "";
    if (this.state.assignee != "" ) {
        assigneeLabel = "Assignee:";
        assignee = this.state.assignee;
    } else {
      assigneeLabel = "Owner:";
      assignee = this.state.owner;
    }
    var storageError = "";
    if (this.state.storageError != "") {
       storageError = <p className="validation-error" ref="validation_error">{this.state.storageError}</p>;
    }
    var assign = "";
    if (this.state.owner === this.state.account) {
        assign = <Assign onAssign={this.onAssign}/>;
    }
    return (<div className="coin-info">
      <h1 className="description pure-u-2-3">
        {this.state.description}
      </h1>

      <div className="pure-g">

        <div className="images pure-u-2-3">
          {imgs}
        </div>

        <div className="coin-info__details pure-u-1-3 pure-form pure-form-stacked">
          <h2 className="coin-info__details__title">Item Details</h2>
          <div className="coinId">
          <label>Item Id:</label>
          <span className="value">{this.state.coinId}</span>
          </div>
          <div className="assignedTo">
          <label>{assigneeLabel}</label> 
          <span className="value">{assignee}</span>
          </div>

          <div className="warehouse">
          <label>Warehouse:</label>
          <span className="value">{this.state.warehouse}</span>
          </div>

          <div className="storagePaidThru">
          <label>Storage Paid Thru:</label>
          <span className="value">{formatTs(this.state.storagePaidThru)}</span>
          </div>

          <div className="storageFee">
          <label>Storage Fee:</label>
          <span className="value">{(this.state.storageFee/1000000000000000000)} Ether/year</span>
          </div>

          <div className="lateFee">
          <label>Late Fee:</label>
          <span className="value">{(this.state.lateFee/1000000000000000000)} Ether</span>
          </div>

          <div className="feesLastChanged">
          <label>Fees Last Changed:</label>
          <span className="value">{formatTs(this.state.feesLastChanged)}</span>
          <span className="coin-details__explainer">* fee can only be changed once per year</span>
          </div>
          <PriceHistory ref="history" onFetchHistory={this.onFetchHistory} />

          {buy}
          <Fineprint onShowInsuredAmount={this.onShowInsuredAmount}/>

          {listable}

          <fieldset>
            {storageError}
            <label>Pay for storage:</label>
            <input className="list-storage__input" type="text" onChange={this.onChangeNumYears}/> <span className="years__details">years at {(this.state.storageFee/1000000000000000000)} Ether/year</span>
            <button onClick={this.onPayStorage} className="pure-button pure-button-primary">Pay for storage</button>
          </fieldset>
          {assign}


          </div>
      </div>

      </div>
    );
  }
}

export default Coin
