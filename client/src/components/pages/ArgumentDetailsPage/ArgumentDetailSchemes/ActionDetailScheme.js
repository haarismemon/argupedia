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
    let criticalQuestions = SCHEMES.action.criticalQuestions;

    criticalQuestions = criticalQuestions.map(cq => {
      cq = QUESTIONS[cq];
      /* eslint-disable no-eval */
      cq.question = eval('`' + cq.question + '`');
      return cq;
    });
    
    this.setState({criticalQuestions});
  }

  render() {
    let { criticalQuestions } = this.state;

    return (
      <div>
        <div>
          <div>In current circumstance R: {this.props.circumstance}</div>
          <div>We should perform action A: {this.props.action}</div>
          <div>Which will result in a new circumstance S: {this.props.newCircumstance}</div>
          <div>Which will achieve goal G: {this.props.goal}</div>
          <div>That will promote value V: {this.props.value}</div>
        </div>
        {this.props.showCriticalQuestions && criticalQuestions !== null ?
          <div>
            <hr/>
            <h6>Critical Questions</h6>
            <ul>
              {
                criticalQuestions.map(cq => {
                  return (<li key={cq.question}><CriticalQuestion question={cq.question} {...this.props}/></li>)
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