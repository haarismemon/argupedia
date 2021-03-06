import React, { Component } from 'react';
import Axios from 'axios';
import { compose } from "recompose";

import ArgumentView from '../ArgumentDetailsPage/ArgumentView';
import PasswordChangeForm from './PasswordChangeForm';
import { withAuthorisation } from '../../Session';
import { withFirebase } from '../../Firebase';
import loadingAnimation from '../../../resources/Reload-1s-100px.svg';
import * as ROUTES from '../../../constants/routes';

class AccountPage extends Component {
  state = {
    submittedArguments: [],
    pageLoading: true
  }

  componentDidMount() {
    const uid = this.props.firebase.auth.currentUser.uid;

    // get a list of all arguments that the currently logged-in user has submitted
    Axios.get(`${ROUTES.ARGUMENT_LIST_USER_SUBMITTED}?uid=${uid}`, {crossdomain: true})
    .then(resp => {
      this.setState({
          submittedArguments: resp.data,
          pageLoading: false
      })
    })
    .catch(console.error)
  }

  handleClick(argumentId) {
    this.props.history.push(`/argument/${argumentId}`)
  }

  render() {
    const {submittedArguments} = this.state;

    return (
      <div className="account-page">
        <h1>Account</h1>
        <PasswordChangeForm />
        <h3>Your submitted arguments:</h3>
        {this.state.pageLoading ? 
          (<div className="loading-animation" style={{textAlign: 'center'}}>
            <h1>Loading...</h1>
            <img src={loadingAnimation} alt="LoadingAnimation"/>
          </div>) 
          : 
          (<div>
            {submittedArguments.map (argument =>
              <ArgumentView 
                key={argument._id} 
                argument={argument} 
                onClick={this.handleClick.bind(this)}
                isPreview={true} />
              )
            }
          </div>)
      }
      </div>
    );
  }
}

const condition = authUser => !!authUser;
const message = "You must be signed in before you can access your account."

export default compose(
  withFirebase,
  withAuthorisation(condition, message)
)(AccountPage)
