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
import SignUpPage from './components/Pages/SignUpPage'
import SignInPage from './components/Pages/SignInPage'
import ForgotPasswordPage from './components/Pages/ForgotPasswordPage'
import AccountPage from './components/Pages/AccountPage'
import Error from './components/Pages/Error'

import { withAuthentication } from './components/Session/index'
import * as ROUTES from './constants/routes'

const App = () => (
  <BrowserRouter>
    <div>
      <Navigation />
      <hr/>
      <Switch>
        <Route path={ROUTES.HOME} component={ArgumentList} exact />
        <Route path={ROUTES.ARGUMENT_DETAILS} component={ArgumentDetails} exact />
        <Route path={ROUTES.SUBMIT_ARGUMENT} component={SubmitArgument} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route component={Error} />
      </Switch>
    </div>
  </BrowserRouter>
)
      
export default withAuthentication(App);