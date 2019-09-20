import React from 'react';

import CriticalQuestion from '../CriticalQuestion'
import {SCHEMES, QUESTIONS} from '../../../../constants/schemes'
import { ListGroup } from 'react-bootstrap';
import LikeButton from '../LikeButton';

class PositionToKnowDetailScheme extends React.Component {
  state = {
    criticalQuestions: null
  }

  componentDidMount() {
    /* eslint-disable no-unused-vars */
    let { source, proposition } = this.props.argument;
    let questionTags = SCHEMES.positionToKnow.criticalQuestions;

    let criticalQuestions = {};

    questionTags.forEach(tag => {
      const cq = QUESTIONS[tag];
      /* eslint-disable no-eval */
      cq.question = eval('`' + cq.question + '`');
      criticalQuestions[tag] = cq;
    });
    
    this.setState({criticalQuestions});
  }

  render() {
    let { criticalQuestions } = this.state;
    let { source, proposition, link } = this.props.argument;

    return (
      <div>
        <div>
          <div>{SCHEMES.positionToKnow.inputQuestions.source} {source}</div>
          <div>{SCHEMES.positionToKnow.inputQuestions.proposition} {proposition}</div>
        </div>
        {this.props.showCriticalQuestions && criticalQuestions !== null ?
          <div className="argument-view-cq">
            {link &&
              <p>Link to related evidence: <a href={link}>{link}</a></p>
            }
            <LikeButton argument={this.props.argument} handleLikeButtonClick={this.props.handleLikeButtonClick}/>
            <hr/>
            <h6>Critical Questions</h6>
            <ListGroup>
              {
                Object.keys(criticalQuestions).map(questionTag => {
                  const criticalQuestion = criticalQuestions[questionTag];
                  return (
                    <div key={criticalQuestion.question}>
                      <CriticalQuestion 
                        question={criticalQuestion.question} 
                        questionTag={questionTag}
                        argument={this.props.argument}
                        {...this.props}
                      />
                    </div>
                  )
                })
              }
            </ListGroup>
          </div>
          : null
        }
      </div>
    );
  }
}

export default PositionToKnowDetailScheme