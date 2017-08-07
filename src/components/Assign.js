import React, { Component } from 'react';

class Assign extends Component {
   constructor(props) {
     super(props);
     this.state = {'assignee':''};
     this.onAssign = this.onAssign.bind(this);
     this.onChangeAssignee = this.onChangeAssignee.bind(this);
   }

   onChangeAssignee(event) {
     this.setState({'assignee':event.target.value});
   }

   onAssign() {
     this.props.onAssign(this.state.assignee);
   }

   render() {
     return (<fieldset>
               <label>Assign name for pickup:</label>
               <p className="coin-details__explainer">Assign a name once you are ready to pick up the item. once
               assigned, item can no longer be re-listed or transferred. 
               Photo id will be required that matches this name on premises.</p>
               <input placeholder="Name" onChange={this.onChangeAssignee} type="text"/> 
               <button onClick={this.onAssign} className="pure-button pure-button-primary">Assign</button>
               </fieldset>
            );
   }
}

export default Assign;
