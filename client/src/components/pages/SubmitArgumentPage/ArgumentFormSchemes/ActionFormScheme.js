import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

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
            In current circumstance R:
          </Form.Label>
          <Form.Control required type="text" name="circumstance" value={this.state.circumstance} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            We should perform action A:
          </Form.Label>
          <Form.Control required type="text" name="action" value={this.state.action} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            Which will result in a new circumstance S:
          </Form.Label>
          <Form.Control required type="text" name="newCircumstance" value={this.state.newCircumstance} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            Which will achieve goal G:
          </Form.Label>
          <Form.Control required type="text" name="goal" value={this.state.goal} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            That will promote value V:
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
