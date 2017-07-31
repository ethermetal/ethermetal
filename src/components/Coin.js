import React, { Component } from 'react';

class Coin extends Component {
  constructor(props) {
    super(props);
    this.state = {'description':'', 'storagePaidThru':0, 'storageFee':0, 'lateFee':0, 'feesLastChanged':0, 'imgs':[]};
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
      return ("" + d.getFullYear() + "-" + this.padZero(d.getMonth()) + "-" +  this.padZero(d.getDay()) + " " +  this.padZero(d.getHours()) + ":" + this.padZero(d.getMinutes()) + ":" + this.padZero(d.getSeconds()));
    }
  }


  render() {
    return (
      <div className="coin-info">
      <span className="description">
      {this.state.description}
      </span>
      <div>
      { this.state.imgs.forEach((imgSrc) => {
          return <img src={imgSrc} />; })
      }
      </div><br/>
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
      </div>
    );
  }
}

export default Coin
