import React from 'react'
import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import Axios from 'axios'

import ActionDetailScheme from './ArgumentDetailSchemes/ActionDetailScheme'
import ExpertDetailScheme from './ArgumentDetailSchemes/ExpertDetailScheme'
import PopularDetailScheme from './ArgumentDetailSchemes/PopularDetailScheme'
import PositionToKnowDetailScheme from './ArgumentDetailSchemes/PositionToKnowDetailScheme'
import CauseToEffectDetailScheme from './ArgumentDetailSchemes/CauseToEffectDetailScheme'
import {SCHEMES} from '../../../constants/schemes';
import { withFirebase } from '../../Firebase';

class ArgumentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      argument: {},
      isPreview: this.props.isPreview
    }

    this._isMounted = false;
    this.handleLikeButtonClick = this.handleLikeButtonClick.bind(this);
    // this.updateArgumentStoredHere = this.updateArgumentStoredHere.bind(this);
  }

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

  handleLikeButtonClick = () => {
    const {argument} = this.state;
    const user = this.props.firebase.auth.currentUser;
    
    if (user) {
      let newLikes = argument.likes;
      let isLikeButton;
      if(newLikes.includes(user.uid)) {
        newLikes.splice(newLikes.indexOf(user.uid), 1);
        isLikeButton = true;
      } else {
        newLikes.push(user.uid);
        isLikeButton = false;
      }

      argument.isLikeButton = isLikeButton;

      Axios.put(`http://localhost:3001/api/argument?id=${argument._id}`, {likes: newLikes})
        .then((resp) => {
          if(this._isMounted) {
            this.setState({
              argument: resp.data
            })
          }
        });
    } else {
      alert("You must be signed in before you like an argument")
    }
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
                        argument={argument}
                        handleLikeButtonClick={this.handleLikeButtonClick} />,
              expert: <ExpertDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}
                        handleLikeButtonClick={this.handleLikeButtonClick} />,
              popular: <PopularDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}
                        handleLikeButtonClick={this.handleLikeButtonClick} />,
              positionToKnow: <PositionToKnowDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}
                        handleLikeButtonClick={this.handleLikeButtonClick} />,
              causeToEffect: <CauseToEffectDetailScheme 
                        showCriticalQuestions={!isPreview} 
                        argument={argument}
                        handleLikeButtonClick={this.handleLikeButtonClick} />
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

export default withFirebase(ArgumentView)
