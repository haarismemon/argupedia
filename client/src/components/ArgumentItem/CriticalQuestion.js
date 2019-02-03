import React from 'react'
import {Button} from 'react-bootstrap'
import {withRouter} from 'react-router'
import { compose } from 'recompose'

import * as ROUTES from '../../constants/routes'
import { withFirebase } from "../Firebase";

class CriticalQuestion extends React.Component {
  agreeArgumentClick = event => {
    this.handleClick(true)
  }

  disagreeArgumentClick = event => {
    this.handleClick(false)
  }

  handleClick(isAgree) {
    const currentUserId = this.props.firebase.auth.currentUser ? this.props.firebase.auth.currentUser.uid : null;
    const parentUserId = this.props.uid;

    if(parentUserId !== currentUserId) {
      this.props.history.push({
        pathname: ROUTES.SUBMIT_ARGUMENT,
        state: {
          criticalQuestion: this.props.question,
          agree: isAgree,
          parentId: this.props._id,
          originalId: this.props.originalId
        }
      })
    } else {
      alert('Unable to respond to an argument you have submitted.')
    }
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

export default compose(withRouter, withFirebase)(CriticalQuestion)

