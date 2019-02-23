import React from 'react'

import CriticalQuestion from '../CriticalQuestion'
import {SCHEMES, QUESTIONS} from '../../../../constants/schemes';

class PopularDetailScheme extends React.Component {
  state = {
    criticalQuestions: null
  }

  componentDidMount() {
    /* eslint-disable no-unused-vars */
    let { proposition } = this.props;
    let criticalQuestions = SCHEMES.popular.criticalQuestions;

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
    let { proposition } = this.props;

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

export default PopularDetailScheme
