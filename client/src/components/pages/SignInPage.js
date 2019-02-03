import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import * as ROUTES from '../../constants/routes'
import { withFirebase } from '../Firebase';

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>
    <SignInForm></SignInForm>
    <ForgotPasswordLink />
    <SignUpLink />
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
        this.props.history.push(ROUTES.HOME)
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
      <form onSubmit={this.onSubmit}>
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={this.onChange}
          placeholder="Email Address"
        /><br/>
        <input 
          type="password" 
          name="password" 
          value={password}
          onChange={this.onChange}
          placeholder="Password"
        /><br/>
        <button type="submit"  disabled={isInvalid}>
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
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
