import React from 'react'
import PropTypes from 'prop-types'

const ArgumentPreview = (props) => (
  <div className="ArgumentPreview">
    <div className="scheme-name">
      Scheme: {props.scheme}
    </div>
    <div className="value-name">
      <div>
        Circumstance: {props.circumstance}
      </div>
      <div>
        Action: {props.action}
      </div>
      <div>
        Goal: {props.goal}
      </div>
      <div>
        Value: {props.value}
      </div>
    </div>
  </div>
)

ArgumentPreview.propTypes = {
  scheme: PropTypes.string.isRequired,
  circumstance: PropTypes.string,
  action: PropTypes.string,
  goal: PropTypes.string,
  value: PropTypes.string
}

export default ArgumentPreview
