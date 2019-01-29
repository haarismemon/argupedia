import React from 'react'
import PropTypes from 'prop-types'

import ActionDetailScheme from './argumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './argumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './argumentDetailSchemes/PopularDetailScheme'

class ArgumentPreview extends React.Component {
  handleClick = () => {
    this.props.onClick(this.props._id)
  }

  render() {
    let schemeName = this.props.scheme;
    switch(schemeName) {
      case("action"):
        schemeName = "Argument for Action"
        break
      case("expert"):
        schemeName = "Argument from Expert Opinion"
        break
      case("popular"):
        schemeName = "Argument from Popular Opinion"
        break
      default:
        schemeName = this.props.scheme
        break
    }

    return (
      <div className="ArgumentPreview" onClick={this.handleClick}>
        <div className="scheme-name">
          Scheme: {schemeName}
        </div>
        {
          {
            action: <ActionDetailScheme {...this.props}/>,
            expert: <ExpertDetailScheme {...this.props}/>,
            popular: <PopularDetailScheme {...this.props}/>
          }[this.props.scheme]
        }
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
