import './App.css'
import React from 'react'
import {
  BrowserRouter, 
  Route, 
  Switch
} from 'react-router-dom'

import NavigationBar from './components/Navigation/NavigationBar'

import SubmitArgumentPage from './components/Pages/SubmitArgumentPage'
import HomePage from './components/Pages/HomePage';
import SearchResultsPage from './components/Pages/SearchResultsPage'
import ArgumentDetails from './components/Pages/ArgumentDetailsPage'
import SignUpPage from './components/Pages/SignUpPage'
import SignInPage from './components/Pages/SignInPage'
import ForgotPasswordPage from './components/Pages/SignInPage/ForgotPassword'
import AccountPage from './components/Pages/AccountPage'
import ErrorPage from './components/Pages/ErrorPage'

import { withAuthentication } from './components/Session/index'
import * as ROUTES from './constants/routes'
import { Container } from 'react-bootstrap';

const App = () => (
  <BrowserRouter>
    <div>
      <NavigationBar />
      <Container className="page-content">
        <Switch>
          <Route path={ROUTES.HOME} component={HomePage} exact />
          <Route path={ROUTES.SEARCH} component={SearchResultsPage} />
          <Route path={ROUTES.ARGUMENT_DETAILS} component={ArgumentDetails} />
          <Route path={ROUTES.SUBMIT_ARGUMENT} component={SubmitArgumentPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route component={ErrorPage} />
        </Switch>
      </Container>
    </div>
  </BrowserRouter>
)
      
export default withAuthentication(App);