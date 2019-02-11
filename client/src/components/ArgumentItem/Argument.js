import React from 'react'

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
      <div className="ArgumentDetails" id={this.state.argument._id}>
        <div className="scheme-name">
          {this.state.argument.title} ({argumentNotRoot ? `${isArgumentPositive} = ` : null }{schemeName})
        </div>
        <div className="value-name">
          {argumentNotRoot ?
            (
              <div>
                <div>Critical Question: {this.state.argument.criticalQuestion}</div><br/>
              </div>
            )
            : null}
          {{
              action: <ActionDetailScheme showCriticalQuestions={true} {...this.state.argument}/>,
              expert: <ExpertDetailScheme showCriticalQuestions={true} {...this.state.argument}/>,
              popular: <PopularDetailScheme showCriticalQuestions={true} {...this.state.argument}/>
            }[this.state.argument.scheme]}
        </div>
      </div>
    );
  }
}

export default Argument
