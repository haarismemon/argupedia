import React from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import ArgumentForm from '../ArgumentForm'

const SubmitArgument = (props) => {
  return (
    <div>
      <Header title="Submit an argument" />
      <Link className="GoBackHomeLink" to="/">Go back home</Link>
      <ArgumentForm {...props.location.state} />
    </div>
  )
}

export default SubmitArgument
