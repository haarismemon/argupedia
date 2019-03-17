import React from 'react'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat';

import ActionDetailScheme from './ArgumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './ArgumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './ArgumentDetailSchemes/PopularDetailScheme'
import PositionToKnowDetailScheme from './ArgumentDetailSchemes/PositionToKnowDetailScheme'
import CauseToEffectDetailScheme from './ArgumentDetailSchemes/CauseToEffectDetailScheme'
import {SCHEMES} from '../../../constants/schemes';

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
    const {argument, isPreview} = this.state;
    const {rootId, highlightId} = this.props;

    const argumentNotRoot = argument.criticalQuestion
    const isArgumentSupport = argument.agree ? "Supporting Argument" : "Attacking Argument";

    let schemeName = argument.scheme;
    const scheme = SCHEMES[schemeName];

    if(scheme !== undefined) {
      schemeName = scheme.name;
    }
    
    const cardTitle = !isPreview ?
                          (`${argumentNotRoot ? `${isArgumentSupport}: ` : ''} ${argument.title}`) :
                          argument.title;

    const createdAtDate = Date.parse(argument.createdAt);
    const submitDate = dateFormat(createdAtDate, 'dd mmmm yyyy "at" HH:MM');

    let highlightArgument = ""; 
    
    if(highlightId) {
      if(highlightId === argument._id) {
        highlightArgument = "argument-view-highlight";
      }
    } else {
      if (rootId && rootId === argument._id) {
        highlightArgument = "argument-view-highlight";
      }
    }
      
    return (
      <Card 
        id={argument._id} 
        onClick={isPreview ? this.handleClick : null}
        className={(isPreview ? "argument-preview argument-view-card" : 
                      `argument-view argument-view-card ${highlightArgument}`)}>
        
        <Card.Header>
          <div className="card-title"><span className="card-title h5">{cardTitle}</span><span className="card-title h6"> ~ submitted by {argument.username}</span></div>
          <Card.Subtitle>
            {schemeName}
            <span className="submit-date">{submitDate}</span>
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          {argumentNotRoot ?
            (
              <h6>
                Critical Question: {argument.criticalQuestion}
              </h6>
            )
            : null}
          {{
              action: <ActionDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument} />,
              expert: <ExpertDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}/>,
              popular: <PopularDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}/>,
              positionToKnow: <PositionToKnowDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}/>,
              causeToEffect: <CauseToEffectDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}/>
            }[argument.scheme]}
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
