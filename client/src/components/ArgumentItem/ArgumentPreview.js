import React from 'react'
import PropTypes from 'prop-types'

import ActionDetailScheme from './ArgumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './ArgumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './ArgumentDetailSchemes/PopularDetailScheme'
import { Card } from 'react-bootstrap';

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
      <Card onClick={this.handleClick}>
        <Card.Body>
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Subtitle>{schemeName}</Card.Subtitle>
          <Card.Text>
            {
              {
                action: <ActionDetailScheme {...this.props}/>,
                expert: <ExpertDetailScheme {...this.props}/>,
                popular: <PopularDetailScheme {...this.props}/>
              }[this.props.scheme]
            }
          </Card.Text>
        </Card.Body>
      </Card>
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
