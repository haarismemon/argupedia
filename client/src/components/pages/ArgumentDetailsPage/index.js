import React from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import './ArgumentDetailsPage.css'
import ArgumentNest from '../ArgumentDetailsPage/ArgumentNest'
import ArgumentView from './ArgumentView';
import ArgumentNetwork from './ArgumentNetwork';
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

class ArgumentDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    
    const params = new URLSearchParams(this.props.location.search)
    const mode = params.get('mode')
    const highlightId = params.get('highlight')

    this.state = {
      rootId: null,
      showNetwork: mode === constants.network.mode,
      networkToggleText: mode === constants.network.mode ? constants.nest.string : constants.network.string,
      networkData: {
        nodes: [],
        edges: []
      },
      argumentNestData: {},
      originalArgument: null,
      pageLoading: true,
      highlightId: highlightId
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

        if(resp.data[rootId]) {
          const originalId = resp.data[rootId].originalId;
          if(originalId !== rootId && originalId !== undefined) {
            axios.get(`http://localhost:3001/argument?id=${originalId}`, {crossdomain: true})
            .then(resp => {
              this.setState({
                originalArgument: resp.data
              });
            })
          }
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
    const originalId = this.state.originalArgument.originalId;
    this.props.history.push(`/argument/${originalId}`);
    this.setState({originalArgument: null});
    this.updateData(originalId);
  }

  render() {
    const { argumentNestData, originalArgument, networkData, highlightId, showNetwork, pageLoading, networkToggleText, rootId } = this.state;

    const rootArgument = argumentNestData[rootId]
    const isRootNotOriginalArgument = originalArgument && originalArgument.id !== rootId;

    return pageLoading ? 
      (<div className="loading-animation" style={{textAlign: 'center'}}>
        <h1>Loading...</h1>
        <img src={loadingAnimation} alt="LoadingAnimation"/>
      </div>) :
      (argumentNestData && networkData ?
        <div>
          <Button variant="info" id="network-toggle" onClick={this.handleNetworkToggle.bind(this)}>{networkToggleText}</Button>
          { isRootNotOriginalArgument &&
            <Button variant="info" onClick={this.originalArgumentLinkHandler.bind(this)}>Go back to original argument</Button>
          }
          {showNetwork ?
            <ArgumentNetwork 
              networkData={networkData}
              nodeSelectHandler={this.nodeSelectHandler} />
            :
            (argumentNestData && rootArgument !== undefined &&
              <div>
                {isRootNotOriginalArgument &&
                  <div>
                    <br/>
                    <p>Preview of the original argument (click below to show full debate):</p>
                    <ArgumentView 
                      argument={originalArgument}
                      isPreview={true}
                      onClick={this.originalArgumentLinkHandler.bind(this)}/>
                    <hr/>
                  </div>
                }
                <ArgumentNest 
                  level={0} 
                  rootId={rootId} 
                  currentId={rootId}
                  argumentData={argumentNestData}
                  highlightId={highlightId}/>
              </div>
                
            )
          }
        </div>
        :
        <h3>No arguments found with provided id</h3>
    )
  }
}

export default ArgumentDetailsPage
