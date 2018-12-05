import React from 'react'

const ArgumentPreview = (argument) => (
  <div className="ArgumentPreview">
    <div className="scheme-name">
      Scheme: {argument.scheme}
    </div>
    <div className="value-name">
      <div>
        Circumstance: {argument.circumstance}
      </div>
      <div>
        Action: {argument.action}
      </div>
      <div>
        Goal: {argument.goal}
      </div>
      <div>
        Value: {argument.value}
      </div>
    </div>
  </div>
)

export default ArgumentPreview
