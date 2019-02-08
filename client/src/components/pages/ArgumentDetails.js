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
      network: null,
      showNetwork: mode === constants.network.mode,
      networkToggleText: mode === constants.network.mode ? constants.nest.string : constants.network.string,
      data: {
        nodes: [],
        edges: []
      },
      argumentData: {}
    }

    this.nodeSelectHandler = this.nodeSelectHandler.bind(this)
    this.updateData = this.updateData.bind(this)

    this._isMounted = false;
  }
  
  componentDidMount() {
    this._isMounted = true;
    this.updateData(this.props.match.params.id)
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }
  

  updateData(rootId) {
    axios.get(`http://localhost:3001/argument/network?id=${rootId}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
          data: resp.data
        })
      }
    })
    .catch(console.error)
    
    axios.get(`http://localhost:3001/argument/descendents?id=${rootId}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
            argumentData: resp.data
        })
      }
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
    var { nodes } = event;

    const mode = constants.nest.mode

    this.setState({
      showNetwork: mode === constants.network.mode,
      networkToggleText: mode === constants.network.mode ? constants.nest.string : constants.network.string,
    });
    
    this.props.history.push('/')
    this.props.history.push(`/argument/${nodes[0]}`)
  }

  originalArgumentLinkHandler() {
    const rootId = this.props.match.params.id
    const argument = this.state.argumentData[rootId]

    this.props.history.push(`/argument/${argument.originalId}`)
    this.updateData(argument.originalId)
  }

  render() {
    // after the nodes have been settled and after 2 seconds, make the network fit the screen
    if(this.state.network) {
      setTimeout(() => {
        this.state.network.fit({
          animation: {
            duration: 4000
          }
        })
      }, 2000);
    }

    var options = {
      physics: {
        solver: 'repulsion',
        repulsion: {
          centralGravity: 0.8,
          springLength: 200,
          springConstant: 0.03,
          nodeDistance: 350,
          damping: 0.15
        },
        barnesHut: {
          avoidOverlap: 1
        }
      },
      interaction: {
        navigationButtons: true,
        zoomView: false
      }
    };

    var events = {
        doubleClick: this.nodeSelectHandler
    }

    const argumentRootId = this.props.match.params.id;
    const originalId = this.state.argumentData[argumentRootId] ? 
      this.state.argumentData[argumentRootId].originalId : undefined;
    const rootArgument = this.state.argumentData[argumentRootId]

    if(this.state.network !== null) {
      this.state.network.fit()
    }

    return (
      <div>
        <h1>Argument</h1>
        <button id="network-toggle" onClick={this.handleNetworkToggle.bind(this)}>{this.state.networkToggleText}</button>
        { originalId !== undefined &&
          <button onClick={this.originalArgumentLinkHandler.bind(this)}>Go back to original argument</button>
        }
        {this.state.showNetwork ?
          <div>
            <p>Double click on a node to get more information. Selected argument becomes the root of the argument nest.</p>
            <div id="argument-network">
              <Graph 
                graph={this.state.data} 
                options={options} 
                events={events} 
                getNetwork={network => this.setState({network})} />
            </div>
          </div>
          :
          (this.state.argumentData && rootArgument !== undefined &&
            <ArgumentNest 
              level={0} 
              rootId={argumentRootId} 
              argumentData={this.state.argumentData}/>)
        }
      </div>
    )
  }
}

export default ArgumentDetails
