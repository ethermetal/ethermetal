import React, { Component } from 'react';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {'price':0};
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onList = this.onList.bind(this);
  }
  onChangePrice(event) {
    this.setState({'price':event.target.value});
  }
  onList(event) {
    this.props.onList(this.state.price); 
  }
  render() {
    return (<div>
            <label>List this Coin:</label>
            <input className="list-coin__input" type="text" placeholder="In wei" onChange={this.onChangePrice} name="price"/>
            <select className="list-coin__select">
              <option>Ether</option>
              <option>Wei</option>
            </select>
            <button onClick={this.onList} className="pure-button pure-button-primary">List Now</button>
            </div>);
  }
}

export default List;
