import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import * as ROUTES from '../../../constants/routes'
import { withFirebase } from '../../Firebase';

import './SignInPage.css'

const SignInPage = () => (
  <div className="row sign-in-page">
    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
      <Card className="card-signin my-5 text-center">
        <h1 className="card-title">Sign In</h1>
        <SignInForm></SignInForm>
        <ForgotPasswordLink />
        <SignUpLink />
      </Card>
    </div>
  </div>
)

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
}

class SignInFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.onChange = this.onChange.bind(this)
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignIn(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.goBack()
      })
      .catch(error => {
        this.setState({ error })
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { email, password, error } = this.state
    
    const isInvalid = email === '' || password === '';

    return (
      <div>
        {error && 
          <Alert variant="danger">
            {error.message}
          </Alert>
        }
        {this.props.location.state && this.props.location.state.authMessage ?
          <Alert variant="danger">
            {this.props.location.state.authMessage}
          </Alert> 
          : null
        }

        <form onSubmit={this.onSubmit} className="form-signin">
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={this.onChange}
            placeholder="Email Address"
            className="form-control"
          />
          <input 
            type="password" 
            name="password" 
            value={password}
            onChange={this.onChange}
            placeholder="Password"
            className="form-control"
          />
          <br/>
          <Button variant="outline-info" 
            type="submit" 
            disabled={isInvalid}
            className="btn btn-lg btn-block">
            Sign In
          </Button>
        </form>
      </div>
    )
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const ForgotPasswordLink = () => (
  <p>
    <Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password?</Link>
  </p>
);

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase)

export default SignInPage
