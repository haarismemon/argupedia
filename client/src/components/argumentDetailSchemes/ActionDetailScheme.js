import React from 'react'

import CriticalQuestion from '../CriticalQuestion'

const ActionDetailScheme = (props) => {
  return (
    <div>
      <div className="value-name">
        <div>In current circumstance R: {props.circumstance}</div>
        <div>We should perform action A: {props.action}</div>
        <div>Which will result in a new circumstance S: {props.newCircumstance}</div>
        <div>Which will achieve goal G: {props.goal}</div>
        <div>That will promote value V: {props.value}</div>
      </div>
      {props.showCriticalQuestions ?
        <div>
          <hr/>
          <h4>Critical Questions</h4>
          <ul>
            <li><CriticalQuestion question={`Is the current circumstance '${props.circumstance}' true?`} argumentId={props._id}/></li>
            <li><CriticalQuestion question={`Does the action '${props.action}' achieve the goal of '${props.goal}'?`} argumentId={props._id}/></li>
            <li><CriticalQuestion question={`Is there an alternative action that achieves the goal '${props.goal}'?`} argumentId={props._id}/></li>
          </ul>
        </div>
        : null
      }
    </div>
  )
}

export default ActionDetailScheme
