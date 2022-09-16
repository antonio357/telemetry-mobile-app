import { Component } from "react";

class ChildComponent extends Component {

  sendMessage=()=>{
      const {websocket} = this.props // websocket instance passed as props to the child component.

      try {
          websocket.send(data) //send data to the server
      } catch (error) {
          console.log(error) // catch error
      }
  }
  render() {
      return (
          <></>
      );
  }
}

export default ChildComponent;
