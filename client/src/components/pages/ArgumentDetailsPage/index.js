import React from 'react'
import axios from 'axios'
import Graph from 'vis-react'
import Button from 'react-bootstrap/Button'
import { Card } from 'react-bootstrap';

import ArgumentNest from '../ArgumentDetailsPage/ArgumentNest'
import './ArgumentDetailsPage.css'
import ArgumentView from './ArgumentView';
import loadingAnimation from '../../../resources/Reload-1s-100px.svg';

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
      rootId: null,
      network: null,
      showNetwork: mode === constants.network.mode,
      networkToggleText: mode === constants.network.mode ? constants.nest.string : constants.network.string,
      networkData: {
        nodes: [],
        edges: []
      },
      argumentNestData: {},
      originalArgument: null,
      pageLoading: true
    }

    this.nodeSelectHandler = this.nodeSelectHandler.bind(this)
    this.updateData = this.updateData.bind(this)

    this._isMounted = false;
  }
  
  componentDidMount() {
    this._isMounted = true;
    if(this.state.networkData !== {}) {
      const rootId = this.props.match.params.id;
      this.setState({rootId});
      this.updateData(rootId)
    }
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }
  

  updateData(rootId) {
    axios.get(`http://localhost:3001/argument/network?id=${rootId}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
          networkData: resp.data
        })
      }
    })
    .catch(console.error)
    
    axios.get(`http://localhost:3001/argument/descendents?id=${rootId}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
            argumentNestData: resp.data
        })

        const originalId = resp.data[rootId].originalId;
        if(originalId !== rootId && originalId !== undefined) {
          axios.get(`http://localhost:3001/argument?id=${originalId}`, {crossdomain: true})
          .then(resp => {
            this.setState({
              originalArgument: resp.data
            });
          })
        }

        this.setState({pageLoading: false});
      }
    })
    .catch(console.error)
  }

  handleNetworkToggle() {
    let newToggleText = null;

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
    let { nodes } = event;

    if(nodes[0] !== undefined) {
      const mode = constants.nest.mode

      this.setState({
        showNetwork: mode === constants.network.mode,
        networkToggleText: mode === constants.network.mode ? constants.nest.string : constants.network.string,
      });
      
      this.props.history.push('/')
      this.props.history.push(`/argument/${nodes[0]}`)
    }
  }

  originalArgumentLinkHandler() {
    this.props.history.push(`/argument/${this.state.originalArgument.originalId}`);
    this.setState({originalArgument: null});
    this.updateData(this.state.originalArgument.originalId)
  }

  render() {
    const { network } = this.state;

    // after the nodes have been settled and after 2 seconds, make the network fit the screen
    if(network) {
      setTimeout(() => {
        network.fit({
          animation: {
            duration: 4000
          }
        })
      }, 3000);
    }

    let options = {
      physics: {
        solver: 'repulsion',
        repulsion: {
          centralGravity: 0.001,
          springLength: 400,
          springConstant: 0.001,
          nodeDistance: 700,
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

    let events = {
        doubleClick: this.nodeSelectHandler
    }

    const argumentRootId = this.props.match.params.id;
    const rootArgument = this.state.argumentNestData[argumentRootId]

    if(this.state.network !== null) {
      this.state.network.fit()
    }

    const isRootNotOriginalArgument = this.state.originalArgument && this.state.originalArgument.id !== this.state.rootId;

    return this.state.pageLoading ? 
      (<div className="loading-animation">
        <h1>Loading...</h1>
        <img src={loadingAnimation} alt="LoadingAnimation"/>
      </div>) :
      (<div>
        <Button variant="info" id="network-toggle" onClick={this.handleNetworkToggle.bind(this)}>{this.state.networkToggleText}</Button>
        { isRootNotOriginalArgument &&
          <Button variant="info" onClick={this.originalArgumentLinkHandler.bind(this)}>Go back to original argument</Button>
        }
        {this.state.showNetwork ?
          <div id="network-page">
            <Card className="key-card">
              <Card.Header>Argument Label Key</Card.Header>
              <Card.Body className="container">
                <div className="row">
                  <div className="col-sm">
                    <div className="key-node in-key-node"/>
                    <label className="key-label">IN Label</label>
                  </div>
                  <div className="col-sm">
                    <div className="key-node out-key-node"/>
                    <label className="key-label">OUT Label</label>
                  </div>
                  <div className="col-sm">
                    <div className="key-node undec-key-node"/>
                    <label className="key-label">UNDEC Label</label>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <p className="network-info"><strong>Double click on a node to get more information. Selected argument becomes the root of the argument nest.</strong></p>
            <div id="argument-network">
              <Graph 
                graph={this.state.networkData} 
                options={options} 
                events={events} 
                getNetwork={network => this.setState({network})} />
            </div>
          </div>
          :
          (this.state.argumentNestData && rootArgument !== undefined &&
            <div>
              {isRootNotOriginalArgument &&
                <div>
                  <br/>
                  <p>Preview of the original argument (click below to show full debate):</p>
                  <ArgumentView 
                    argument={this.state.originalArgument}
                    isPreview={true}
                    onClick={this.originalArgumentLinkHandler.bind(this)}/>
                  <hr/>
                </div>
              }
              <ArgumentNest 
                level={0} 
                rootId={argumentRootId} 
                currentId={argumentRootId}
                argumentData={this.state.argumentNestData}/>
            </div>
              
          )
        }
      </div>
    )
  }
}

export default ArgumentDetails
