import './App.css'
import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import SubmitArgument from './components/SubmitArgument'
import ArgumentList from './components/ArgumentList'
import Error from './components/Error'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={ArgumentList} exact />
          <Route path="/argument/:id" component={SubmitArgument} exact />
          <Route path="/submit" component={SubmitArgument} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
