import React from 'react'
import {Button} from 'react-bootstrap'
import {withRouter} from 'react-router'

class CriticalQuestion extends React.Component {
  agreeArgumentClick = event => {
    this.props.history.push({
      pathname: '/submit',
      state: {
        criticalQuestion: this.props.question,
        agree: true
       }
    })
  }

  disagreeArgumentClick = event => {
    this.props.history.push({
      pathname: '/submit',
      state: {
        criticalQuestion: this.props.question,
        agree: false
       }
    })
  }

  render() {
    return (
      <div>
        <p style={{display: 'inline'}}>{this.props.question}</p>
        <span>
          <Button onClick={this.agreeArgumentClick}>Y</Button>
          <Button onClick={this.disagreeArgumentClick}>N</Button>
        </span>
      </div>
    )
  }
}

export default withRouter(CriticalQuestion)
