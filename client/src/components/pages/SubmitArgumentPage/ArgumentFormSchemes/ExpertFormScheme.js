import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class ExpertScheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      source: "",
      domain: "",
      assertion: ""
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
            There is a source E:
          </Form.Label>
          <Form.Control required type="text" name="source" value={this.state.source} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            Who is an expert in subject domain D:
          </Form.Label>
          <Form.Control required type="text" name="domain" value={this.state.domain} onChange={this.handleInputChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            The source makes the assestion A that:
          </Form.Label>
          <Form.Control required type="text" name="assertion" value={this.state.assertion} onChange={this.handleInputChange} />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={this.handleClick.bind(this)}>
          Submit
        </Button>
      </div>
    )
  }
}

export default ExpertScheme
