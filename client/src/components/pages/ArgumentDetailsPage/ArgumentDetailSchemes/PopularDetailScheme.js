import React from 'react'

import CriticalQuestion from '../CriticalQuestion'
import {SCHEMES, QUESTIONS} from '../../../../constants/schemes';

class PopularDetailScheme extends React.Component {
  state = {
    criticalQuestions: null
  }

  componentDidMount() {
    /* eslint-disable no-unused-vars */
    let { proposition } = this.props.argument;
    let questionTags = SCHEMES.popular.criticalQuestions;

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
    let { proposition } = this.props.argument;

    return (
      <div>
        <div>
          <div>Proposition A is generally accepted as being true, that gives a reason in favour of A: {proposition}</div>
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

export default PopularDetailScheme
