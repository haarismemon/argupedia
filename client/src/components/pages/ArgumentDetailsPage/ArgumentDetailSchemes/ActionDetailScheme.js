import React from 'react';

import CriticalQuestion from '../CriticalQuestion'
import {SCHEMES, QUESTIONS} from '../../../../constants/schemes'
import { ListGroup } from 'react-bootstrap';

class ActionDetailScheme extends React.Component {
  state = {
    criticalQuestions: null
  }

  componentDidMount() {
    /* eslint-disable no-unused-vars */
    let { circumstance, action, newCircumstance, goal, value } = this.props.argument;
    let questionTags = SCHEMES.action.criticalQuestions;

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
    let { circumstance, action, newCircumstance, goal, value } = this.props.argument;

    return (
      <div>
        <div>
          <div>{SCHEMES.action.inputQuestions.circumstance} {circumstance}</div>
          <div>{SCHEMES.action.inputQuestions.action} {action}</div>
          <div>{SCHEMES.action.inputQuestions.newCircumstance} {newCircumstance}</div>
          <div>{SCHEMES.action.inputQuestions.goal} {goal}</div>
          <div>{SCHEMES.action.inputQuestions.value} {value}</div>
        </div>
        {this.props.showCriticalQuestions && criticalQuestions !== null ?
          <div>
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

export default ActionDetailScheme