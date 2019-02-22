import React from 'react'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'

import ActionDetailScheme from './ArgumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './ArgumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './ArgumentDetailSchemes/PopularDetailScheme'
import SCHEMES from '../../../constants/schemes'

class ArgumentView extends React.Component {
  state = {
    argument: {},
    isPreview: this.props.isPreview
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

  handleClick = () => {
    this.props.onClick(this.state.argument._id)
  }

  render() {
    const argumentNotRoot = this.state.argument.criticalQuestion
    const isArgumentPositive = this.state.argument.agree ? "Positive" : "Negative"

    let schemeName = this.state.argument.scheme;
    const scheme = SCHEMES[schemeName];

    if(scheme !== undefined) {
      schemeName = scheme.name;
    }
    
    const cardTitle = this.state.argument.title;
    const cardSubtitle = !this.state.isPreview ?
                          (`${argumentNotRoot ? `${isArgumentPositive} = ` : ''} ${schemeName}`) :
                          schemeName;

    return (
      <Card 
        id={this.state.argument._id} 
        onClick={this.state.isPreview ? this.handleClick : null}
        className={this.state.isPreview ? "argument-preview" : "argument-view"}>
        
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
          <Card.Subtitle>{cardSubtitle}</Card.Subtitle>
          </Card.Header>
        <Card.Body>
          {argumentNotRoot ?
            (
              <div>
                Critical Question: {this.state.argument.criticalQuestion}
              </div>
            )
            : null}
          {{
              action: <ActionDetailScheme 
                        showCriticalQuestions={!this.state.isPreview} 
                        {...this.state.argument} />,
              expert: <ExpertDetailScheme 
                        showCriticalQuestions={!this.state.isPreview} 
                        {...this.state.argument}/>,
              popular: <PopularDetailScheme 
                        showCriticalQuestions={!this.state.isPreview} 
                        {...this.state.argument}/>
            }[this.state.argument.scheme]}
        </Card.Body>
      </Card>
    );
  }
}

ArgumentView.propTypes = {
  argument: PropTypes.object,
  onClick: PropTypes.func
}

export default ArgumentView
