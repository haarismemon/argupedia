import React from 'react'

import ArgumentForm from '../ArgumentItem/ArgumentForm'
import { withAuthorisation } from '../Session';

const SubmitArgument = (props) => {
  return (
    <div>
      <h1>Submit an argument</h1>
      <ArgumentForm {...props.location.state} />
    </div>
  )
}

const condition = authUser => !!authUser;
const message = "You must be signed in before you can submit."

export default withAuthorisation(condition, message)(SubmitArgument)
