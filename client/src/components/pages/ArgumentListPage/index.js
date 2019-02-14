import React from 'react'
import axios from 'axios'

import ArgumentView from '../ArgumentDetailsPage/ArgumentView'

class ArgumentListPage extends React.Component {
  state = {
    arguments: []
  }
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    axios.get('http://localhost:3001/argument/list', {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
            arguments: resp.data
        })
      }
    })
    .catch(console.error)
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  

  handleClick(argumentId) {
    this.props.history.push(`/argument/${argumentId}`)
  }

  render() {
    return (
      <div>
        <h1>Arguments List</h1>
        {this.state.arguments.map (argument =>
          <ArgumentView 
            key={argument._id} 
            argument={argument} 
            onClick={this.handleClick.bind(this)}
            isPreview={true} />
        )}
      </div>
    );
  }
}

export default ArgumentListPage;
