import React from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import ArgumentNest from '../ArgumentNest'

const ArgumentDetails = (props) => {
  return (
    <div>
      <Header title="Argument" />
      <ArgumentNest level={0} rootId={props.match.params.id}/>
      <Link className="GoBackHomeLink" to="/">Go back home</Link>
    </div>
  )
}

export default ArgumentDetails
