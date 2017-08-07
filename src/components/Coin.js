import React, { Component } from 'react';
import List from './List';
import Assign from './Assign';

class Coin extends Component {
  constructor(props) {
    super(props);
    this.state = {'coinId':-1,'description':'', 'storagePaidThru':0, 'storageFee':0, 'lateFee':0, 'feesLastChanged':0, 'imgUrls':[], 'listable':true, 'listingPrice':0, 'storageFeeToPay':0, 'numStorageYears':0, 'assignee':'', hidden:true};
    this.onList = this.onList.bind(this);
    this.onAssign = this.onAssign.bind(this);
    this.onBuy = this.onBuy.bind(this);
    this.onPayStorage = this.onPayStorage.bind(this);
    this.onChangeNumYears = this.onChangeNumYears.bind(this);
  }
  padZero(num) {
      if(num <= 9 && num >= 0) {
          return '0' + num;
      } else {
          return(num);
      }
  }

  formatTs(ts) {
    if (ts === 0) {
      return "";
    } else {
      var d = new Date(ts*1000);
      return ("" + d.getFullYear() + "-" + this.padZero(d.getMonth()) + "-" +  this.padZero(d.getDate()) + " " +  this.padZero(d.getHours()) + ":" + this.padZero(d.getMinutes()) + ":" + this.padZero(d.getSeconds()));
    }
  }
  onList(price) {
     this.props.onList(this.state.coinId, price);
  }
  onAssign(assignee) {
     this.props.onAssign(this.state.coinId, assignee);
  }
  onBuy(event) {
     this.props.onBuy(this.state.coinId, this.state.listingPrice);
  }
  onPayStorage(event) {
      var fee = 0;
      if(Date.now() > this.state.storagePaidThru*1000) {
         fee += this.state.lateFee;
      }
      fee += parseInt(this.state.numStorageYears)*this.state.storageFee;
      this.props.onPayStorage(this.state.coinId, fee);
  }
  onChangeNumYears(event) {
      this.setState({'numStorageYears':parseInt(event.target.value)});
  }

  render() {
    if (this.state.hidden) {
        return <div/>;
    }
    var listable = "";
    if (this.state.listable) {
        listable = <List onList={this.onList}/>;
    }
    var buy = ""
    if (this.state.listingPrice != 0) {
        buy = <button onClick={this.onBuy}>Buy for {this.state.listingPrice} Wei</button>;
    }
    var imgs = [];
    var n =0;
    this.state.imgUrls.forEach((imgSrc) => {
       imgs.push(<img src={imgSrc} key={"img_" + n} className="pure-img" />);
       n++;
    });

    var assignee = "";
    if(this.state.assignee != "" ) {
        assignee = <span>Assignee: {this.state.assignee}</span>;
    }
    return (<div className="coin-info">
      <h1 className="description">
      {this.state.description}
      </h1>

      <div className="pure-g">

        <div className="images pure-u-2-3">
        {imgs }
        </div>

        <div className="coin-info__details pure-u-1-3 pure-form pure-form-stacked">
          <h2 className="coin-info__details__title">Details</h2>
          
          <div className="assignedTo">
          <label>Assigned to:</label> 
          <span className="value">{assignee}</span>
          </div>

          <div className="storagePaidThru">
          <label>Storage Paid Thru:</label>
          <span className="value">{this.formatTs(this.state.storagePaidThru)}</span>
          </div>

          <div className="storageFee">
          <label>Storage Fee:</label>
          <span className="value">{(this.state.storageFee/1000000000000000000)} Ether/year</span>
          </div>

          <div className="lateFee">
          <label>Late Fee:</label>
          <span className="value">{(this.state.lateFee/1000000000000000000)} Ether/year</span>
          </div>

          <div className="feesLastChanged">
          <label>Fees Last Changed:</label>
          <span className="value">{this.formatTs(this.state.feesLastChanged)} <br />(fee can only be changed once per year)</span>
          </div>

          <Assign onAssign={this.onAssign}/>

          <fieldset>
            {listable}
          </fieldset>

          {buy}

          <fieldset>
            <label>Pay for storage:</label>
            <input type="text" placeholder="Number of years" onChange={this.onChangeNumYears}/> 
            <button onClick={this.onPayStorage} className="pure-button pure-button-primary">Pay for storage</button><br/><br/>
          </fieldset>

          </div>
      </div>

      </div>
    );
  }
}

export default Coin
