import React from 'react'
import PropTypes from 'prop-types'

class ArgumentPreview extends React.Component {
  handleClick = () => {
    this.props.onClick(this.props._id)
  }

  render() {
    return (
      <div className="ArgumentPreview" onClick={this.handleClick}>
        <div className="scheme-name">
          Scheme: {this.props.scheme}
        </div>
        <div className="value-name">
          <div>
            Circumstance: {this.props.circumstance}
          </div>
          <div>
            Action: {this.props.action}
          </div>
          <div>
            Goal: {this.props.goal}
          </div>
          <div>
            Value: {this.props.value}
          </div>
        </div>
      </div>
    )
  }
}

ArgumentPreview.propTypes = {
  scheme: PropTypes.string.isRequired,
  circumstance: PropTypes.string,
  action: PropTypes.string,
  goal: PropTypes.string,
  value: PropTypes.string
}

export default ArgumentPreview
