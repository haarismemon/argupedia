import './App.css'
import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import SubmitArgument from './components/pages/SubmitArgument'
import ArgumentList from './components/pages/ArgumentList'
import ArgumentDetails from './components/pages/ArgumentDetails'
import Error from './components/pages/Error'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={ArgumentList} exact />
          <Route path="/argument/:id" component={ArgumentDetails} exact />
          <Route path="/submit" component={SubmitArgument} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
