import React from 'react'

const ActionDetailScheme = (props) => {
  return (
    <div className="value-name">
      <div>In current circumstance R: {props.circumstance}</div>
      <div>We should perform action A: {props.action}</div>
      <div>Which will result in a new circumstance S: {props.newCircumstance}</div>
      <div>Which will achieve goal G: {props.goal}</div>
      <div>That will promote value V: {props.value}</div>
    </div>
  )
}

export default ActionDetailScheme
