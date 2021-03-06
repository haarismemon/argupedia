import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { Card } from 'react-bootstrap';
import {compose} from 'recompose'

import ActionFormScheme from './ArgumentFormSchemes/ActionFormScheme'
import ExpertFormScheme from './ArgumentFormSchemes/ExpertFormScheme'
import PopularFormScheme from './ArgumentFormSchemes/PopularFormScheme'
import PositionToKnowFormScheme from './ArgumentFormSchemes/PositionToKnowFormScheme'
import CauseToEffectFormScheme from './ArgumentFormSchemes/CauseToEffectFormScheme'
import ArgumentView from '../ArgumentDetailsPage/ArgumentView';
import {SCHEMES, QUESTIONS} from '../../../constants/schemes';
import { withFirebase } from '../../Firebase';
import './ArgumentForm.css';
import * as ROUTES from '../../../constants/routes';

class ArgumentForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      criticalQuestionTag: this.props.criticalQuestionTag,
      criticalQuestion: this.props.criticalQuestion,
      agree: this.props.agree,
      scheme: '',
      title: '',
      link: '',
      parentId: this.props.parentId,
      originalId: this.props.originalId,
      uid: this.props.authUser.uid,
      username: this.props.authUser.displayName,
      ancestorIds: this.props.ancestorIds,
      likes: [],
      validated: false,
      ignoreSchemes: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if(this.props.criticalQuestionTag) {
      const ignoreSchemes = QUESTIONS[this.props.criticalQuestionTag].ignoreSchemes;
      this.setState({ignoreSchemes});
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleChildClick(state) {
    this.setState(state)
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if(form.checkValidity() === false) {
      event.preventDefault();
    } else {
      // adds the parent id to the list of ancestors
      if(this.state.ancestorIds === undefined) {
        this.setState({ ancestorIds: [], validated: true });
      } else {
        const newAncestorIds = this.props.ancestorIds.push(this.props.parentId)
        this.setState({ ancestorIds: newAncestorIds, validated: true });
      }

      axios.post(ROUTES.ARGUMENT_SINGLE, {...this.state})
        .then((resp) => {
          const redirectArgumentId = resp.data.originalId ? `${resp.data.originalId}?highlight=${resp.data._id}` : resp.data._id;
          this.props.history.push(`/argument/${redirectArgumentId}`);
        });
    }
  }

  handleParentArgumentClick() {
    this.props.history.push(`/argument/${this.props.parentArgument._id}`)
  }

  checkSchemeIsIgnored(scheme) {
    const {ignoreSchemes} = this.state;
    return ignoreSchemes.includes(scheme);
  }

  render() {
    const { validated } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} validated={validated} id="argument-form">
        {this.props.parentArgument &&
          <div>
            <h6>Preview of the original argument:</h6>
            <ArgumentView argument={this.props.parentArgument} isPreview={true} onClick={this.handleParentArgumentClick.bind(this)}/>
            <hr/>
          </div>
        }
        <h1>Submit an argument</h1>
        {this.props.criticalQuestion ? 
          <div>
            <p>Critical Question being <strong>{this.props.agree ? "agreed" : "disagreed"}</strong> with:</p>
            <Card className="critical-question-card">
              <Card.Body>{this.props.criticalQuestion}</Card.Body>
            </Card> 
          </div>
          : null}
        <Form.Group>
          <Form.Label>
            Argument scheme
            {this.state.ignoreSchemes.length > 0 && 
              <small><br/>Choice of schemes have been constrained to only allow ones that are appropriate for this specific critical question</small>
            }
          </Form.Label>
          <Form.Control required as="select" name="scheme" value={this.state.scheme} onChange={this.handleInputChange}>
            <option value="" disabled hidden>Select a template to format your argument</option>
            {
              Object.values(SCHEMES).map(argumentScheme => 
                <option 
                  value={argumentScheme.scheme} 
                  key={argumentScheme.scheme} 
                  disabled={this.checkSchemeIsIgnored(argumentScheme.scheme)}>
                    {argumentScheme.name} {this.checkSchemeIsIgnored(argumentScheme.scheme) ? "(disabled)" : ""}
                </option>
              )
            }
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Title
          </Form.Label>
          <Form.Control 
            required
            type="text" 
            name="title" 
            value={this.state.title} 
            onChange={this.handleInputChange}
            placeholder="e.g. Debate for use of renewable energy to prevent global warming"/>
        </Form.Group>
        {this.state.scheme === '' && 
          <div>
            <br/>
            <Alert variant="info">Please select an argument scheme above to continue.</Alert>
          </div>  
        }        
        {this.state.scheme &&
          <Form.Group>
            <Form.Label>
              Link to related evidence for argument being submitted 
            </Form.Label>
            <Form.Control 
              type="url" 
              name="link" 
              value={this.state.link} 
              onChange={this.handleInputChange}
              placeholder="e.g. https://www.wikipedia.org/"/>
          </Form.Group>
        }
        {
          {
            action: <ActionFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>,
            expert: <ExpertFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>,
            popular: <PopularFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>,
            positionToKnow: <PositionToKnowFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>,
            causeToEffect: <CauseToEffectFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>
          }[this.state.scheme]
        }
      </Form>
    )
  }

}

ArgumentForm.propTypes = {
  criticalQuestionTag: PropTypes.string,
  criticalQuestion: PropTypes.string,
  agree: PropTypes.bool,
  parentId: PropTypes.string,
  originalId: PropTypes.string,
  ancestorIds: PropTypes.array
};

export default compose(withRouter, withFirebase)(ArgumentForm)
