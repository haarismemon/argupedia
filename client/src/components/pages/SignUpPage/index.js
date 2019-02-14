import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

import { withFirebase } from '../../Firebase'
import * as ROUTES from '../../../constants/routes'

import './SignUpPage.css'

const SignUpPage = () => (
  <div className="row sign-up-page">
    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
      <Card className="card-signup my-5 text-center">
        <h1 className="card-title">Sign Up</h1>
        <SignUpForm />
      </Card>
    </div>
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
        // creates a user in the Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
          });
      })
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
      <div>
        {error && 
          <Alert variant="warning">
            {error.message}
          </Alert>
        }
        <form onSubmit={this.onSubmit} className="form-signup">
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="Full Name"
            className="form-control"
          />
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
            name="passwordOne" 
            value={passwordOne}
            onChange={this.onChange}
            placeholder="Password"
            className="form-control"
          />
          <input 
            type="password" 
            name="passwordTwo" 
            value={passwordTwo}
            onChange={this.onChange}
            placeholder="Confirm Password"
            className="form-control"
          /><br/>
          <Button 
            type="submit" 
            disabled={isInvalid}
            className="btn btn-lg btn-primary btn-block">
            Sign Up
          </Button>
        </form>
      </div>
    )
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase)

export default SignUpPage
