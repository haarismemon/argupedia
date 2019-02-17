import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

import { withFirebase } from '../../Firebase';
import './AccountPage.css'

let INITIAL_STATE = {
  currentPassword: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  passwordChanged: false
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { currentPassword, passwordOne, passwordTwo } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    if(isInvalid) {
      this.setState({
        error: {
          message: "The passwords do not match."
        }
      });
    } else {
      this.props.firebase
        .doSignIn(this.props.firebase.auth.currentUser.email, currentPassword)
        .then(() => {
          this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
              INITIAL_STATE['passwordChanged'] = true
              this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
              this.setState({ error });
            });
        })
        .catch(error => {
          this.setState({ 
            error: {
              message: "The current password entered is invalid."
            }
          });
        });
    }
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { currentPassword, passwordOne, passwordTwo, error, passwordChanged } = this.state;

    return (
      <div className="row password-change-page">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card-password-change my-5 text-center">
            <h3 className="card-title">Change Password</h3>

            {error && 
              <Alert variant="danger">
                {error.message}
              </Alert>
            }

            {passwordChanged && 
              <Alert variant="success">
                Password has been successfully changed.
              </Alert>
            }

            <form onSubmit={this.onSubmit} className="form-password-change">
              <FormControl
                name="currentPassword"
                value={currentPassword}
                onChange={this.onChange}
                type="password"
                placeholder="Current Password"
              />
              <FormControl
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="New Password"
              />
              <FormControl
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm New Password"
              />
              <br/>
              <Button type="submit">
                Change Password
              </Button>
            </form>
          </Card>
      </div>
    </div>

    );
  }
}

export default withFirebase(PasswordChangeForm);