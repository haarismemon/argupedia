import React, { Component } from 'react';
import './App.css';

import ArgumentForm from './components/ArgumentForm'

class App extends Component {
  render() {
    return (
      <div>
        <h1>Argupedia</h1>
        <ArgumentForm />
      </div>
    );
  }
}

export default App;
