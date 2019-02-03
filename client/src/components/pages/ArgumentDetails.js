import React from 'react'
import axios from 'axios'
import Graph from 'vis-react'

import ArgumentNest from '../ArgumentItem/ArgumentNest'

const constants = {
  network: {
    mode: 'network',
    string: 'Show Argument Network'
  },
  nest: {
    mode: 'nest',
    string: 'Show Nested Arguments'
  }
}

class ArgumentDetails extends React.Component {
  constructor(props) {
    super(props);
    
    const params = new URLSearchParams(this.props.location.search)
    const mode = params.get('mode')

    this.state = {
      showNetwork: mode == constants.network.mode,
      networkToggleText: mode == constants.network.mode ? constants.nest.string : constants.network.string,
      data: {
        nodes: [],
        edges: []
      }
    }

    this.nodeSelectHandler = this.nodeSelectHandler.bind(this)
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
      newToggleText = constants.network.string
      this.props.history.push({
        search: '?mode=' + constants.nest.mode
      })
    } else {
      newToggleText = constants.nest.string
      this.props.history.push({
        search: '?mode=' + constants.network.mode
      })
    }

    this.setState({
      showNetwork: !this.state.showNetwork,
      networkToggleText: newToggleText
    })
  }

  nodeSelectHandler = event => {
    var { nodes, edges } = event;

    const mode = constants.nest.mode

    this.setState({
      showNetwork: mode == constants.network.mode,
      networkToggleText: mode == constants.network.mode ? constants.nest.string : constants.network.string,
    });
    
    this.props.history.push({
      search: '?mode=' + constants.nest.mode + "#" + nodes[0]
    })
  }

  render() {
    var options = {
      physics: {
        solver: 'repulsion',
        repulsion: {
          centralGravity: 0.6,
          springLength: 200,
          springConstant: 0.05,
          nodeDistance: 150,
          damping: 0.15
        }
      }
    };

    var events = {
        select: this.nodeSelectHandler
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
