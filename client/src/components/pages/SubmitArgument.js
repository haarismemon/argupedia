import React from 'react'

import ArgumentForm from '../ArgumentItem/ArgumentForm'

const SubmitArgument = (props) => {
  return (
    <div>
      <h1>Submit an argument</h1>
      <ArgumentForm {...props.location.state} />
    </div>
  )
}

export default SubmitArgument
