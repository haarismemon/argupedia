import React from 'react'
import axios from 'axios'

import ActionDetailScheme from './argumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './argumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './argumentDetailSchemes/PopularDetailScheme'

class Argument extends React.Component {
  state = {
    argument: {}
  }

  componentDidMount() {
    axios.get(`http://localhost:3001/argument?id=${this.props.argumentId}`, {crossdomain: true})
    .then(resp => {
      this.setState({
          argument: resp.data
      })
    })
    .catch(console.error)
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
      <div className="ArgumentDetails">
        <div className="scheme-name">
          {argumentNotRoot ? `${isArgumentPositive} : ` : null }{schemeName}
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
