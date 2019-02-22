import React from 'react'

import CriticalQuestion from '../CriticalQuestion'
import SCHEMES from '../../../../constants/schemes'

class ExpertDetailScheme extends React.Component {
  state = {
    criticalQuestions: null
  }

  componentDidMount() {
    /* eslint-disable no-unused-vars */
    let { source, domain, assertion } = this.props;
    let criticalQuestions = SCHEMES.expert.criticalQuestions;

    criticalQuestions.forEach(cq => {
      /* eslint-disable no-eval */
      cq.question = eval('`' + cq.question + '`');
    });
    
    this.setState({criticalQuestions});
  }

  render() {
    let { criticalQuestions } = this.state;
    let { source, domain, assertion } = this.props;

    return (
      <div>
        <div>
          <div>There is a source E: {source}</div>
          <div>Who is an expert in subject domain D: {domain}</div>
          <div>The source makes the assestion A that: {assertion}</div>
        </div>
        {this.props.showCriticalQuestions && criticalQuestions !== null?
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

export default ExpertDetailScheme
