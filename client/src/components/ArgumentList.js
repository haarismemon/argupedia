import React from 'react'
import axios from 'axios'

import ArgumentPreview from './ArgumentPreview'
import Header from './Header'

class ArgumentList extends React.Component {
  state = {
    arguments: []
  }

  componentDidMount() {
    axios.get('http://localhost:3001/argument/list', {crossdomain: true})
    .then(resp => {
      this.setState({
          arguments: resp.data
      })
    })
    .catch(console.error)
  }

  render() {
    return (
      <div>
        <Header title="Arguments List" />
        {this.state.arguments.map (argument =>
          <ArgumentPreview key={argument._id} {...argument} />
        )}
      </div>
    );
  }
}

export default ArgumentList;
