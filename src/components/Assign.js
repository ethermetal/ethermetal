import React, { Component } from 'react';

class Assign extends Component {
   constructor(props) {
     super(props);
     this.state = {'assignee':''};
     this.onChangeAssignee = this.onChangeAssignee.bind(this);
   }

   onChangeAssignee(event) {
     this.setState({'assignee':event.target.value});
   }

   onAssign() {
     this.props.onAssign(this.state.assignee);
   }

   render() {
     return (<div>
               <label>Assignee</label><input onChange={this.onChangeAssignee} type="text"/> 
               <button onClick={this.onAssign}>Assign</button>
               </div>
            );
   }
}

export default Assign;
