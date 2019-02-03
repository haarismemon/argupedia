import React from 'react'
import PasswordChangeForm from './PasswordChangeForm';
import { withAuthorisation } from '../Session';

const AccountPage = () => (
  <div>
    <h1>Account</h1>

    <h3>Change Password Form</h3>
    <PasswordChangeForm />
  </div>
)

const condition = authUser => !!authUser;
const message = "You must be signed in before you can access your account."

export default withAuthorisation(condition, message)(AccountPage)
