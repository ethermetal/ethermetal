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
            <label>Price:</label><input type="text" onChange={this.onChangePrice} name="price"/> (in Wei) <button onClick={this.onList}>List</button>
            </div>);
  }
}

export default List;
