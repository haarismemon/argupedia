import React from 'react'
import {Button, ListGroup} from 'react-bootstrap'
import {withRouter} from 'react-router'
import { compose } from 'recompose'

import * as ROUTES from '../../../constants/routes'
import { withFirebase } from "../../Firebase";

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
          criticalQuestionTag: this.props.questionTag,
          criticalQuestion: this.props.question,
          agree: isAgree,
          parentId: this.props._id,
          originalId: this.props.originalId,
          ancestorIds: this.props.ancestorIds,
          parentArgument: this.props.argument
        }
      })
    } else {
      alert('Unable to respond to an argument you have submitted.')
    }
  }

  render() {
    return (
      <ListGroup.Item className="cq-list-group">
        <p className="cq-text" style={{display: 'inline'}}>{this.props.question}</p>
        <div className="cq-button-group">
          <Button variant="success" className="cq-button" id="yesButton" onClick={this.agreeArgumentClick}>
            Agree <i class="far fa-thumbs-up"></i>
          </Button>
          <Button variant="danger" className="cq-button" id="noButton" onClick={this.disagreeArgumentClick}>
            Disagree <i class="far fa-thumbs-down"></i>
          </Button>
        </div>
      </ListGroup.Item>
    )
  }
}

export default compose(withRouter, withFirebase)(CriticalQuestion)

