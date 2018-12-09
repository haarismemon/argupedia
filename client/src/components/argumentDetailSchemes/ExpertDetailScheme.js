import React from 'react'

import CriticalQuestion from '../CriticalQuestion'

const ExpertDetailScheme = (props) => {
  return (
    <div>
      <div className="value-name">
        <div>There is a source E: {props.source}</div>
        <div>Who is an expert in subject domain D: {props.domain}</div>
        <div>The source makes the assestion A that: {props.assertion}</div>
      </div>
      {props.showCriticalQuestions ?
        <div>
          <hr/>
          <h4>Critical Questions</h4>
          <ul>
            <li><CriticalQuestion question={`How credible is '${props.source}' an expert?`} argumentId={props._id}/></li>
            <li><CriticalQuestion question={`Is '${props.source}' an expert in the field that the assertion '${props.assertion}' is in?`} argumentId={props._id}/></li>
            <li><CriticalQuestion question={`Is the assertion '${props.assertion}' consistent with what other experts assert?`} argumentId={props._id}/></li>
          </ul>
        </div>
        : null
      }
    </div>
  )
}

export default ExpertDetailScheme
