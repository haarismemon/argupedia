import './App.css';
import React, { Component } from 'react';
import axios from 'axios'

import ArgumentForm from './components/ArgumentForm'
import ArgumentPreview from './components/ArgumentPreview'

class App extends Component {
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
        <h1 className="Title">Argupedia</h1>
        <ArgumentForm className="Form"/>
        {this.state.arguments.map (argument =>
          <ArgumentPreview key={argument._id} {...argument} />
        )}
      </div>
    );
  }
}

export default App;
