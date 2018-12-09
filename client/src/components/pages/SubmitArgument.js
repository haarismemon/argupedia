import React from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import ArgumentForm from '../ArgumentForm'

const SubmitArgument = () => {
  return (
    <div>
      <Header title="Submit an argument" />
      <ArgumentForm />
      <Link className="GoBackHomeLink" to="/">Go back home</Link>
    </div>
  )
}

export default SubmitArgument
