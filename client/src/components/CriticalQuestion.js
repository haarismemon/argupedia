import React from 'react'
import {Button} from 'react-bootstrap'
import {withRouter} from 'react-router'

class CriticalQuestion extends React.Component {
  agreeArgumentClick = event => {
    this.handleClick(true)
  }

  disagreeArgumentClick = event => {
    this.handleClick(false)
  }

  handleClick(isAgree) {
    this.props.history.push({
      pathname: '/submit',
      state: {
        criticalQuestion: this.props.question,
        agree: isAgree,
        parentId: this.props.argumentId
       }
    })
  }

  render() {
    return (
      <div>
        <p style={{display: 'inline'}}>{this.props.question}</p>
        <span>
          <Button id="yesButton" onClick={this.agreeArgumentClick}>Y</Button>
          <Button id="noButton" onClick={this.disagreeArgumentClick}>N</Button>
        </span>
      </div>
    )
  }
}

export default withRouter(CriticalQuestion)
