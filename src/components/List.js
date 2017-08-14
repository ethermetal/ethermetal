import React, { Component } from 'react';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {'price':0, 'units':'Ether'};
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onList = this.onList.bind(this);
    this.onUnlist = this.onUnlist.bind(this);
    this.onChangeUnits = this.onChangeUnits.bind(this);
  }
  onChangePrice(event) {
    var price = event.target.value;
    if (this.state.units === 'Ether') {
        price *= 1e18;
    }
    if (price !== this.state.price) {
       this.setState({'price':price});
    }

  }
  onList(event) {
    this.props.onList(this.state.price); 
  }
  onUnlist(event) {
    this.props.onUnlist(); 
  }
  refreshPrice() {
    var price = this.state.price;
    if (this.state.units === 'Ether') {
        price /= 1e18;
    }
    this.refs.price.value = price; 
  }
  onChangeUnits(event) {
    this.setState({'units':event.target.value});

  }
  render() {
       if (this.props.listed) {
          return (<div>
            <label>List this Coin:</label>
            <p className="coin-details__explainer">Listing the coin will allow anyone to purchase for the specified price. After listing, the item will remain listed until unlisted or purchased.</p>
            <input className="list-coin__input" type="text" onChange={this.onChangePrice} name="price" ref="price" />
            <select className="list-coin__select" onChange={this.onChangeUnits}>
              <option value="Ether">Ether</option>
              <option value="Wei">Wei</option>
            </select>
            <button onClick={this.onList} className="pure-button pure-button-primary">List Now</button>
            </div>);
        } else {
           return (<div>
               <button onClick={this.onUnlist} className="pure-button pure-button-primary">Unlist Now</button>
               </div>);
        }
  }
}

export default List;
