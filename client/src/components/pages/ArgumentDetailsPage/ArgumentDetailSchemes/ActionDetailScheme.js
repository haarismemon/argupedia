import React from 'react';

import CriticalQuestion from '../CriticalQuestion'
import {SCHEMES, QUESTIONS} from '../../../../constants/schemes'

class ActionDetailScheme extends React.Component {
  state = {
    criticalQuestions: null
  }

  componentDidMount() {
    /* eslint-disable no-unused-vars */
    let { circumstance, action, newCircumstance, goal, value } = this.props;
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
    let { circumstance, action, newCircumstance, goal, value } = this.props;

    return (
      <div>
        <div>
          <div>In current circumstance R: {circumstance}</div>
          <div>We should perform action A: {action}</div>
          <div>Which will result in a new circumstance S: {newCircumstance}</div>
          <div>Which will achieve goal G: {goal}</div>
          <div>That will promote value V: {value}</div>
        </div>
        {this.props.showCriticalQuestions && criticalQuestions !== null ?
          <div>
            <hr/>
            <h6>Critical Questions</h6>
            <ul>
              {
                Object.keys(criticalQuestions).map(questionTag => {
                  const criticalQuestion = criticalQuestions[questionTag];
                  return (
                    <li key={criticalQuestion.question}>
                      <CriticalQuestion 
                        question={criticalQuestion.question} 
                        questionTag={questionTag}
                        {...this.props}
                      />
                    </li>
                  )
                })
              }
            </ul>
          </div>
          : null
        }
      </div>
    );
  }
}

export default ActionDetailScheme