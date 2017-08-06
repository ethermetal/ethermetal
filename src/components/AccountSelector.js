import React, { Component } from 'react';

class AccountSelector extends Component {
    constructor(props) {
        super(props);
        this.onChangeAccount = this.onChangeAccount.bind(this);
    }
    onChangeAccount(event) {
        this.props.onChangeAccount(event.target.value);  
    }
    render() {
       var accounts = [];
       for(var n=0;n<this.props.accounts.length;n++) {
           accounts.push(<option value={this.props.accounts[n]}>{this.props.accounts[n]}</option>);
       }
       return (<select onChange={this.onChangeAccount} key="accountSelect">{accounts}</select>);
    } 
}

export default AccountSelector;
