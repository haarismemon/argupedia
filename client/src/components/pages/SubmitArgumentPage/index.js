import React from 'react'

import ArgumentForm from './ArgumentForm'
import { withAuthorisation } from '../../Session';
import { AuthUserContext } from "../../Session";

const SubmitArgumentPage = (props) => {
  return (
    <div>
      <h1>Submit an argument</h1>
      <AuthUserContext.Consumer>
        {authUser =>
          <ArgumentForm {...props.location.state} authUser={authUser}/>
        }
      </AuthUserContext.Consumer>
    </div>
  )
}

const condition = authUser => !!authUser;
const message = "You must be signed in before you can submit."

export default withAuthorisation(condition, message)(SubmitArgumentPage)
