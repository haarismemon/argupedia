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
        <div>
          <Switch>
            <Route path="/" component={ArgumentList} exact />
            <Route path="/submit" component={SubmitArgument} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
