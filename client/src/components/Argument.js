import React from 'react'
import axios from 'axios'

import CriticalQuestion from './CriticalQuestion'

class Argument extends React.Component {
  state = {
    argument: {}
  }

  componentDidMount() {
    axios.get(`http://localhost:3001/argument?id=${this.props.argumentId}`, {crossdomain: true})
    .then(resp => {
      this.setState({
          argument: resp.data
      })
    })
    .catch(console.error)
  }

  render() {
    return (
      <div className="ArgumentDetails">
        <div className="scheme-name">
          Scheme: {this.state.argument.scheme}
        </div>
        <div className="value-name">
          <div>
            Circumstance: {this.state.argument.circumstance}
          </div>
          <div>
            Action: {this.state.argument.action}
          </div>
          <div>
            New circumstance: {this.state.argument.newCircumstance}
          </div>
          <div>
            Goal: {this.state.argument.goal}
          </div>
          <div>
            Value: {this.state.argument.value}
          </div><hr/>
          <h4>Critical Questions</h4>
          <ul>
            <li><CriticalQuestion question={`Is the current circumstance '${this.state.argument.circumstance}' true?`} argumentId={this.state.argument._id}/></li>
            <li><CriticalQuestion question={`Does the action '${this.state.argument.action}' achieve the goal of '${this.state.argument.goal}'?`} argumentId={this.state.argument._id}/></li>
            <li><CriticalQuestion question={`Is there an alternative action that achieves the goal '${this.state.argument.goal}'?`} argumentId={this.state.argument._id}/></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Argument
