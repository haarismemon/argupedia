import React from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import './ArgumentDetailsPage.css'
import ArgumentDetails from './ArgumentDetails';
import ArgumentGraph from './ArgumentGraph';
import loadingAnimation from '../../../resources/Reload-1s-100px.svg';
import * as ROUTES from '../../../constants/routes';

const constants = {
  graph: {
    mode: 'graph',
    string: 'Show Argument Graph'
  },
  nest: {
    mode: 'nest',
    string: 'Show Debate'
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
      showGraph: mode === constants.graph.mode,
      graphToggleText: mode === constants.graph.mode ? constants.nest.string : constants.graph.string,
      graphData: {
        nodes: [],
        edges: []
      },
      argumentNestData: {},
      originalArgument: null,
      pageLoading: true,
      highlightId: highlightId,
      isLike: false
    }

    this.nodeSelectHandler = this.nodeSelectHandler.bind(this)
    this.updateData = this.updateData.bind(this)
    this.updateGraphData = this.updateGraphData.bind(this)
    this.originalArgumentLinkHandler = this.originalArgumentLinkHandler.bind(this)

    this._isMounted = false;
  }
  
  componentDidMount() {
    this._isMounted = true;
    if(this.state.graphData !== {}) {
      const rootId = this.props.match.params.id;
      this.setState({rootId});
      this.updateData(rootId)
    }
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  updateData(rootId) {
    this.updateGraphData(rootId, false);
    
    // get list of all the descendents for the root argument of the debate
    axios.get(`${ROUTES.ARGUMENT_LIST_DESCENDENTS}?id=${rootId}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
            argumentNestData: resp.data
        })

        if(resp.data[rootId]) {
          const originalId = resp.data[rootId].originalId;
          if(originalId !== rootId && originalId !== undefined) {
            // get the details for the original argument of the debate, if the root is not the original
            axios.get(`${ROUTES.ARGUMENT_SINGLE}?id=${originalId}`, {crossdomain: true})
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

  updateGraphData = (rootId, useLikes) => {
    // get the graph data for the root argument of the debate
    axios.get(`${ROUTES.ARGUMENT_LIST_NETWORK}?id=${rootId}&useLikes=${useLikes}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
          graphData: resp.data
        })
      }
    })
    .catch(console.error)
  }

  handleGraphToggle() {
    let newToggleText = null;

    if(this.state.showGraph) {
      newToggleText = constants.graph.string
      this.props.history.push({
        search: '?mode=' + constants.nest.mode
      })
    } else {
      newToggleText = constants.nest.string
      this.props.history.push({
        search: '?mode=' + constants.graph.mode
      })
    }

    this.setState({
      showGraph: !this.state.showGraph,
      graphToggleText: newToggleText
    })
  }

  nodeSelectHandler = event => {
    let { nodes } = event;

    if(nodes[0] !== undefined) {
      const mode = constants.nest.mode

      this.setState({
        showGraph: mode === constants.graph.mode,
        graphToggleText: mode === constants.graph.mode ? constants.nest.string : constants.graph.string,
      });
      
      this.props.history.push('/')
      this.props.history.push(`/argument/${nodes[0]}`)
    }
  }

  originalArgumentLinkHandler() {
    const originalId = this.state.originalArgument._id;
    this.props.history.push(`/argument/${originalId}`);
    this.setState({originalArgument: null, rootId: originalId});
    this.updateData(originalId);
  }

  saveLikeCheckBox = (isLike) => {
    this.setState({isLike: isLike});
  }

  render() {
    const { argumentNestData, originalArgument, graphData, highlightId, showGraph, pageLoading, graphToggleText, rootId } = this.state;

    const rootArgument = argumentNestData[rootId]
    const isRootNotOriginalArgument = originalArgument && originalArgument.id !== rootId;

    return pageLoading ? 
      (<div className="loading-animation" style={{textAlign: 'center'}}>
        <h1>Loading...</h1>
        <img src={loadingAnimation} alt="LoadingAnimation"/>
      </div>) :
      (argumentNestData && graphData ?
        <div>
          <Button variant="info" id="graph-toggle" onClick={this.handleGraphToggle.bind(this)}>{graphToggleText}</Button>
          { isRootNotOriginalArgument &&
            <Button variant="info" onClick={this.originalArgumentLinkHandler}>Go back to original argument</Button>
          }
          {showGraph ?
            <ArgumentGraph 
              graphData={graphData}
              nodeSelectHandler={this.nodeSelectHandler}
              rootId={rootId}
              updateGraphData={this.updateGraphData}
              saveLikeCheckBox={this.saveLikeCheckBox}
              isLike={this.state.isLike} />
            :
            (argumentNestData && rootArgument !== undefined &&
              <ArgumentDetails
                argumentNestData={argumentNestData}
                originalArgument={originalArgument}
                rootId={rootId}
                highlightId={highlightId}
                isRootNotOriginalArgument={isRootNotOriginalArgument}
                originalArgumentLinkHandler={this.originalArgumentLinkHandler} />  
            )
          }
        </div>
        :
        <h3>No arguments found with provided id</h3>
    )
  }
}

export default ArgumentDetailsPage
