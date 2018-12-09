import React from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import ArgumentForm from '../ArgumentForm'

class SubmitArgument extends React.Component {
  render() {
    return (
      <div>
        <Header title="Submit an argument" />
        <ArgumentForm {...this.props.location.state} />
        <Link className="GoBackHomeLink" to="/">Go back home</Link>
      </div>
    )
  }
}

export default SubmitArgument
