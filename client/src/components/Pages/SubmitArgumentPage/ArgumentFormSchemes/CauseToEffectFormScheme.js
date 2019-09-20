import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import {SCHEMES} from '../../../../constants/schemes';

class CauseToEffectFormScheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cause: "",
      effect: "",
      evidence: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleClick() {
    this.props.clickHandler(this.state)
  }

  render() {
    return (
      <div>
        <Form.Group>
          <Form.Label>
            {SCHEMES.causeToEffect.inputQuestions.cause}
          </Form.Label>
          <Form.Control required type="text" name="cause" value={this.state.cause} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            {SCHEMES.causeToEffect.inputQuestions.effect}
          </Form.Label>
          <Form.Control required type="text" name="effect" value={this.state.effect} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            {SCHEMES.causeToEffect.inputQuestions.evidence}
          </Form.Label>
          <Form.Control required type="text" name="evidence" value={this.state.evidence} onChange={this.handleInputChange} />
        </Form.Group>

        <Button variant="outline-success" type="submit" onClick={this.handleClick.bind(this)}>
          Submit
        </Button>
      </div>
    )
  }
}

export default CauseToEffectFormScheme
