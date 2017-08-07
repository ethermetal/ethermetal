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
               <label>Assignee:</label>
               <input placeholder="Name" onChange={this.onChangeAssignee} type="text"/> 
               <button onClick={this.onAssign} className="pure-button pure-button-primary">Assign</button>
               </fieldset>
            );
   }
}

export default Assign;
