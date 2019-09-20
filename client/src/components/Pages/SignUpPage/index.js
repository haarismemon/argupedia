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
  accessCode: '',
  error: null
}

class SignUpFormBase extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.onChange = this.onChange.bind(this)
  }

  onSubmit = event => {
    event.preventDefault()
    const { username, email, passwordOne, passwordTwo, accessCode } = this.state
    this.setState({
      error: null
    });

    const isPasswordInvalid = passwordOne !== passwordTwo;
    console.log(process.env.REACT_APP_ACCOUNT_ACCESS_CODE);
    const isAccessCodeInvalid = accessCode != process.env.REACT_APP_ACCOUNT_ACCESS_CODE;

    if (isAccessCodeInvalid) {
      this.setState({
        error: {
          message: "The access code is not valid. Unable to create account."
        }
      });
    } else if(isPasswordInvalid) {
      this.setState({
        error: {
          message: "The passwords do not match."
        }
      });
    } else {
      this.props.firebase
        .doSignUp(email, passwordOne)
        .then(authUser => {
          const user = this.props.firebase.auth.currentUser
          user.updateProfile({
            displayName: username
          })

          this.setState({ ...INITIAL_STATE })
          this.props.history.push(ROUTES.HOME)
        })
        .catch(error => {
          this.setState({ error })
        })
    }
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
      accessCode,
      error
    } = this.state

    const isInvalid =
      passwordOne === '' ||
      passwordTwo === '' ||
      accessCode === '' ||
      email === '' ||
      username === ''

    return (
      <div>
        {error && 
          <Alert variant="danger">
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
          />
          <input 
            type="text" 
            name="accessCode" 
            value={accessCode}
            onChange={this.onChange}
            placeholder="Access Code to Create Account"
            className="form-control"
          /><br/>
          <Button variant="outline-info" 
            type="submit" 
            disabled={isInvalid}
            className="btn btn-lg btn-block">
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
