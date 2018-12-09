import React from 'react'
import axios from 'axios'

import Argument from './Argument'

class ArgumentNest extends React.Component {
  state = {
    childrenArguments: []
  }

  componentDidMount() {
    axios.get(`http://localhost:3001/argument/children?id=${this.props.rootId}`, {crossdomain: true})
    .then(resp => {
      this.setState({
          childrenArguments: resp.data
      })
    })
    .catch(console.error)
  }

  render() {
    return (
      <div style={this.props.level != 0 ? {marginLeft: '60px'} : {}}>
        <Argument argumentId={this.props.rootId}/>
        {this.state.childrenArguments.map(argument =>
          <ArgumentNest level={this.props.level + 1} rootId={argument._id} />
        )}
      </div>
    );
  }
}

export default ArgumentNest
