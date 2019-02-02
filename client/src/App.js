import './App.css'
import React from 'react'
import {
  BrowserRouter, 
  Route, 
  Switch
} from 'react-router-dom'

import Navigation from './components/Navigation'

import SubmitArgument from './components/Pages/SubmitArgument'
import ArgumentList from './components/Pages/ArgumentList'
import ArgumentDetails from './components/Pages/ArgumentDetails'
import SignUp from './components/Pages/SignUp'
import SignIn from './components/Pages/SignIn'
import ForgotPassword from './components/Pages/ForgotPassword'
import Account from './components/Pages/Account'
import Error from './components/Pages/Error'

import * as ROUTES from './constants/routes'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navigation />
        <hr/>
        <Switch>
          <Route path={ROUTES.HOME} component={ArgumentList} exact />
          <Route path={ROUTES.ARGUMENT_DETAILS} component={ArgumentDetails} exact />
          <Route path={ROUTES.SUBMIT_ARGUMENT} component={SubmitArgument} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route path={ROUTES.ACCOUNT} component={Account} />
          <Route component={Error} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
