import React from 'react'

import CriticalQuestion from '../CriticalQuestion'

const PopularDetailScheme = (props) => {
  return (
    <div>
      <div className="value-name">
        <div>Proposition A is generally accepted as being true, that gives a reason in favour of A: {props.proposition}</div>
      </div>
      {props.showCriticalQuestions ?
        <div>
          <hr/>
          <h4>Critical Questions</h4>
          <ul>
            <li><CriticalQuestion question={`What evidence do we have for believing that '${props.proposition}' is generally accepted?`} argumentId={props._id}/></li>
            <li><CriticalQuestion question={`Are there good reasons for doubting the accuracy of '${props.proposition}'?`} argumentId={props._id}/></li>
          </ul>
        </div>
        : null
      }
    </div>
  )
}

export default PopularDetailScheme
