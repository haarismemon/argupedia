import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import {SCHEMES} from '../../../../constants/schemes';

class ActionScheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      circumstance: "",
      action: "",
      newCircumstance: "",
      goal: "",
      value: ""
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
            {SCHEMES.action.inputQuestions.circumstance}
          </Form.Label>
          <Form.Control required type="text" name="circumstance" value={this.state.circumstance} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            {SCHEMES.action.inputQuestions.action}
          </Form.Label>
          <Form.Control required type="text" name="action" value={this.state.action} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            {SCHEMES.action.inputQuestions.newCircumstance}
          </Form.Label>
          <Form.Control required type="text" name="newCircumstance" value={this.state.newCircumstance} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            {SCHEMES.action.inputQuestions.goal}
          </Form.Label>
          <Form.Control required type="text" name="goal" value={this.state.goal} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            {SCHEMES.action.inputQuestions.value}
          </Form.Label>
          <Form.Control required type="text" name="value" value={this.state.value} onChange={this.handleInputChange} />
        </Form.Group>
        
        <Button variant="outline-success" type="submit" onClick={this.handleClick.bind(this)}>
          Submit
        </Button>
      </div>
    )
  }
}

export default ActionScheme
