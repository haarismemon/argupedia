import React from 'react'
import {Button, ListGroup, Container, Row, Col} from 'react-bootstrap'
import {withRouter} from 'react-router'
import * as ROUTES from '../../../constants/routes'

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
        criticalQuestionTag: this.props.questionTag,
        criticalQuestion: this.props.question,
        agree: isAgree,
        parentId: this.props.argument._id,
        originalId: this.props.argument.originalId,
        ancestorIds: this.props.argument.ancestorIds,
        likes: this.props.argument.likes,
        parentArgument: this.props.argument
      }
    })
  }

  render() {
    return (
      <ListGroup.Item className="cq-list-group">
        <Container>
          <Row>
            <Col className="cq-question">
              <p className="cq-text" style={{display: 'inline'}}>{this.props.question}</p>
            </Col>
            <Col xs={3.5}>
              <div className="cq-button-group">
                <Button variant="success" className="cq-button" id="yesButton" onClick={this.agreeArgumentClick}>
                  Support <i className="far fa-thumbs-up"></i>
                </Button>
                <Button variant="danger" className="cq-button" id="noButton" onClick={this.disagreeArgumentClick}>
                  Attack <i className="far fa-thumbs-down"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    )
  }
}

export default withRouter(CriticalQuestion)

