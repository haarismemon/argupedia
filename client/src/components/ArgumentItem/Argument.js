import React from 'react'
import Card from 'react-bootstrap/Card'

import ActionDetailScheme from './ArgumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './ArgumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './ArgumentDetailSchemes/PopularDetailScheme'

class Argument extends React.Component {
  state = {
    argument: {}
  }
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    let argument = this.props.argument;

    if(this.props.argument.originalId == null) {
      argument.originalId = argument._id;
    }

    if(this._isMounted) {
      this.setState({
          argument: argument
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const argumentNotRoot = this.state.argument.criticalQuestion
    const isArgumentPositive = this.state.argument.agree ? "Positive" : "Negative"

    let schemeName = this.state.argument.scheme;
    switch(schemeName) {
      case("action"):
        schemeName = "Argument for Action"
        break
      case("expert"):
        schemeName = "Argument from Expert Opinion"
        break
      case("popular"):
        schemeName = "Argument from Popular Opinion"
        break
      default:
        schemeName = this.state.argument.scheme
        break
    }

    return (
      <Card id={this.state.argument._id}>
        <Card.Body>
          <Card.Title>{this.state.argument.title}</Card.Title>
          <Card.Subtitle>{argumentNotRoot ? `${isArgumentPositive} = ` : null }{schemeName}</Card.Subtitle>
          <br/>
          <Card.Text>
            {argumentNotRoot ?
              (
                <div>
                  Critical Question: {this.state.argument.criticalQuestion}
                </div>
              )
              : null}
            {{
                action: <ActionDetailScheme showCriticalQuestions={true} {...this.state.argument}/>,
                expert: <ExpertDetailScheme showCriticalQuestions={true} {...this.state.argument}/>,
                popular: <PopularDetailScheme showCriticalQuestions={true} {...this.state.argument}/>
              }[this.state.argument.scheme]}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default Argument
