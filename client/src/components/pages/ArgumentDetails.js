import React from 'react'
import {Link} from 'react-router-dom'
import Graph from 'vis-react'

import Header from '../Header'
import ArgumentNest from '../ArgumentNest'

class ArgumentDetails extends React.Component {
  state = {
    showNetwork: false,
    networkToggleText: 'Show Argument Network'
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
    var graph = {
      nodes: [
          {id: 1, label: 'Node 1'},
          {id: 2, label: 'Node 2'},
          {id: 3, label: 'Node 3'},
          {id: 4, label: 'Node 4'},
          {id: 5, label: 'Node 5'}
        ],
      edges: [
          {from: 1, to: 2},
          {from: 1, to: 3},
          {from: 2, to: 4},
          {from: 2, to: 5}
        ]
    };

    var options = {};

    var events = {
        select: function(event) {
            var { nodes, edges } = event;
        }
    }

    return (
      <div>
        <Header title="Argument" />
        <Link className="GoBackHomeLink" to="/">Go back home</Link>
        <button id="network-toggle" onClick={this.handleNetworkToggle.bind(this)}>{this.state.networkToggleText}</button>
        {this.state.showNetwork ?
          <div id="argument-network">
            <Graph graph={graph} options={options} events={events} />
          </div>
          :
          <ArgumentNest level={0} rootId={this.props.match.params.id}/>
        }
      </div>
    )
  }
}

export default ArgumentDetails
