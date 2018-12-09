import React from 'react'

const ExpertDetailScheme = (props) => {
  return (
    <div className="value-name">
      <div>There is a source E: {props.source}</div>
      <div>Who is an expert in subject domain D: {props.domain}</div>
      <div>The source makes the assestion A that: {props.assertion}</div>
    </div>
  )
}

export default ExpertDetailScheme
