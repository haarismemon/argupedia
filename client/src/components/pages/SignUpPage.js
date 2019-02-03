import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

const SignUpPage = () => (
  <div>
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
)

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.onChange = this.onChange.bind(this)
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state

    this.props.firebase
      .doSignUp(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      .catch(error => {
        this.setState({ error })
      })
    
    event.preventDefault()
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        /><br/>
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={this.onChange}
          placeholder="Email Address"
        /><br/>
        <input 
          type="password" 
          name="passwordOne" 
          value={passwordOne}
          onChange={this.onChange}
          placeholder="Password"
        /><br/>
        <input 
          type="password" 
          name="passwordTwo" 
          value={passwordTwo}
          onChange={this.onChange}
          placeholder="Confirm Password"
        /><br/>
        <button type="submit" disabled={isInvalid}>
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase)

export default SignUpPage