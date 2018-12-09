import React from 'react'
import axios from 'axios'

class Argument extends React.Component {
  state = {
    parentArgument: {}
  }

  componentDidMount() {
    axios.get(`http://localhost:3001/argument?id=${this.props.parentId}`, {crossdomain: true})
    .then(resp => {
      this.setState({
          parentArgument: resp.data
      })
    })
    .catch(console.error)
  }

  render() {
    return (
      <div className="ArgumentDetails">
        <div className="scheme-name">
          Scheme: {this.state.parentArgument.scheme}
        </div>
        <div className="value-name">
          <div>
            Circumstance: {this.state.parentArgument.circumstance}
          </div>
          <div>
            Action: {this.state.parentArgument.action}
          </div>
          <div>
            Goal: {this.state.parentArgument.goal}
          </div>
          <div>
            Value: {this.state.parentArgument.value}
          </div>
        </div>
      </div>
    );
  }
}

export default Argument
