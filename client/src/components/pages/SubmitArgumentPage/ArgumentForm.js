import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

import ActionFormScheme from './ArgumentFormSchemes/ActionFormScheme'
import ExpertFormScheme from './ArgumentFormSchemes/ExpertFormScheme'
import PopularFormScheme from './ArgumentFormSchemes/PopularFormScheme'
import SCHEMES from '../../../constants/schemes'

class ArgumentForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      criticalQuestion: this.props.criticalQuestion,
      agree: this.props.agree,
      scheme: '',
      title: '',
      parentId: this.props.parentId,
      originalId: this.props.originalId,
      uid: this.props.authUser.uid,
      ancestorIds: this.props.ancestorIds,
      validated: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

      axios.post('http://localhost:3001/argument', {...this.state})
        .then(() => {
          this.props.history.goBack()
        });
    }
  }

  render() {
    const { validated } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} validated={validated}>
        {this.props.criticalQuestion ? <h4>{this.props.criticalQuestion} {this.props.agree ? "Agree" : "Disagree"}</h4> : null}
        <Form.Group>
          <Form.Label>
            Argument scheme
          </Form.Label>
          <Form.Control required as="select" name="scheme" value={this.state.scheme} onChange={this.handleInputChange}>
            <option value="" disabled hidden>Select your argument scheme option</option>
            {
              Object.values(SCHEMES).map(argumentScheme => 
                <option value={argumentScheme.scheme} key={argumentScheme.scheme}>{argumentScheme.name}</option>
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
        {
          {
            action: <ActionFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>,
            expert: <ExpertFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>,
            popular: <PopularFormScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/>
          }[this.state.scheme]
        }
      </Form>
    )
  }

}

ArgumentForm.propTypes = {
  criticalQuestion: PropTypes.string,
  agree: PropTypes.bool,
  parentId: PropTypes.string,
  originalId: PropTypes.string,
  ancestorIds: PropTypes.array
};

export default withRouter(ArgumentForm)
