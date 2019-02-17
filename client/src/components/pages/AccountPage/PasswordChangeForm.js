import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'

import { withFirebase } from '../../Firebase';
import './AccountPage.css'

let INITIAL_STATE = {
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
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        INITIAL_STATE['passwordChanged'] = true
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error, passwordChanged } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <div className="row forgot-page">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card-forgot my-5 text-center">
            <h3 className="card-title">Change Password Form</h3>
            <form onSubmit={this.onSubmit} className="form-forgot">
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
              <Button disabled={isInvalid} type="submit">
                Reset My Password
              </Button>

              {error && <p>{error.message}</p>}
              {passwordChanged && <p>Password has been successfully changed.</p>}
            </form>
          </Card>
      </div>
    </div>

    );
  }
}

export default withFirebase(PasswordChangeForm);