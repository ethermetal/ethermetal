import React, { Component } from 'react';

class Fineprint extends Component {
    constructor(props) {
        super(props);
        this.onShowInsuredAmount = this.onShowInsuredAmount.bind(this);
    }
    onShowInsuredAmount() {
        this.props.onShowInsuredAmount();
    }
    render() {
       return(<p className="fineprint2">Terms: Purchasing this item will entitle you to re-list it for sale or assign it to a legal name, whereby it may be picked at the specified warehouse. The owner shall be responsible for paying applicable storage fees. Late storage fees shall be subject to late fee. In the unlikely event the item is lost or stolen, we will pay out insured amount converted into Ethereum. Click <span className="popupLink"  onClick={this.onShowInsuredAmount}>here</span> for insured value. If storage fees are past due for a year, we may repo the coin. We can raise the storage and late fees up to 4% per year or lower these fees in accordance with the Solidity contract. </p>);
    }
}

export default Fineprint;
