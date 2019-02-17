import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

import { withFirebase } from '../../Firebase';

const PasswordForget = () => (
  <div>
    <h1>Forgot Password</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
  emailSent: false
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        INITIAL_STATE['emailSent'] = true;
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error, emailSent } = this.state;

    const isInvalid = email === '';

    return (
      <div className="row forgot-page">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card-forgot my-5 text-center">
            <h3 className="card-title">Reset Password</h3>

            {error && 
              <Alert variant="danger">
                {error.message}
              </Alert>
            }

            {emailSent && 
              <Alert variant="success">
                Email has been sent.
              </Alert>
            }

            <form onSubmit={this.onSubmit} className="form-reset-password">
              <Form.Label>You will be sent an email to reset password.</Form.Label>
              <FormControl
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="email"
                placeholder="Email Address"
              />
              <br/>
              <Button disabled={isInvalid} type="submit">
                Reset Password
              </Button>
            </form>
            </Card>
          </div>
        </div>
    );
  }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default withFirebase(PasswordForget);

