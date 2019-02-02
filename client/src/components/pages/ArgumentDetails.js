import React from 'react'
import axios from 'axios'
import Graph from 'vis-react'

import ArgumentNest from '../ArgumentItem/ArgumentNest'

class ArgumentDetails extends React.Component {
  state = {
    showNetwork: false,
    networkToggleText: 'Show Argument Network',
    data: {}
  }
  
  componentDidMount() {
    axios.get(`http://localhost:3001/argument/network?id=${this.props.match.params.id}`, {crossdomain: true})
    .then(resp => {
      this.setState({
        data: resp.data
      })
    })
    .catch(console.error)
  }

  handleNetworkToggle() {
    var newToggleText = null;

    if(this.state.showNetwork) {
      newToggleText = 'Show Argument Network'
    } else {
      newToggleText = 'Show Nested Arguments'
    }

    this.setState({
      showNetwork: !this.state.showNetwork,
      networkToggleText: newToggleText
    })
  }

  render() {
    var options = {};

    var events = {
        select: function(event) {
            var { nodes, edges } = event;
            console.log(nodes, edges);
        }
    }

    return (
      <div>
        <h1>Argument</h1>
        <button id="network-toggle" onClick={this.handleNetworkToggle.bind(this)}>{this.state.networkToggleText}</button>
        {this.state.showNetwork ?
          <div id="argument-network">
            <Graph graph={this.state.data} options={options} events={events} />
          </div>
          :
          <ArgumentNest level={0} rootId={this.props.match.params.id}/>
        }
      </div>
    )
  }
}

export default ArgumentDetails
