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
      <span className="description">
      {this.state.description}
      </span>
      <div className="images">
      {imgs }
      </div>
      {assignee}
      <span className="storagePaidThru">
      Storage Paid Thru:{this.formatTs(this.state.storagePaidThru)}
      </span><br/>
      <span className="storageFee">
      Storage Fee:{(this.state.storageFee/1000000000000000000)} Ether/year
      </span><br/>
      <span className="lateFee">
      Late Fee:{(this.state.lateFee/1000000000000000000)} Ether/year
      </span><br/>
      <span className="feesLastChanged">
      Fees Last Changed:{this.formatTs(this.state.feesLastChanged)} (fee can only be changed once per year)
      </span>
      <Assign onAssign={this.onAssign}/>
      {listable}
      {buy}
      <input type="text" onChange={this.onChangeNumYears}/> years <button onClick={this.onPayStorage} >Pay for storage</button><br/><br/>
      </div>
    );
  }
}

export default Coin
