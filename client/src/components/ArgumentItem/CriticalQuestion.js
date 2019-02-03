import React from 'react'
import {Button} from 'react-bootstrap'
import {withRouter} from 'react-router'

import * as ROUTES from '../../constants/routes'

class CriticalQuestion extends React.Component {
  agreeArgumentClick = event => {
    this.handleClick(true)
  }

  disagreeArgumentClick = event => {
    this.handleClick(false)
  }

  handleClick(isAgree) {
    this.props.history.push({
      pathname: ROUTES.SUBMIT_ARGUMENT,
      state: {
        criticalQuestion: this.props.question,
        agree: isAgree,
        parentId: this.props.argumentId,
        originalId: this.props.originalId
       }
    })
  }

  render() {
    return (
      <div>
        <p style={{display: 'inline'}}>{this.props.question}</p>
        <span>
          <Button className="cq-button" id="yesButton" onClick={this.agreeArgumentClick}>Y</Button>
          <Button className="cq-button" id="noButton" onClick={this.disagreeArgumentClick}>N</Button>
        </span>
      </div>
    )
  }
}

export default withRouter(CriticalQuestion)