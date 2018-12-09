import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';

import ActionScheme from './argumentSchemes/ActionScheme'

class ArgumentForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      criticalQuestion: this.props.criticalQuestion,
      agree: this.props.agree,
      scheme: "action",
      parentId: this.props.parentId
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
    event.preventDefault()

    axios.post('http://localhost:3001/argument', {...this.state})
      .then(() => {
        this.props.history.goBack()
      })

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="Form">
        {this.props.criticalQuestion ? <h4>{this.props.criticalQuestion} {this.props.agree ? "Agree" : "Disagree"}</h4> : null}
        <label>
          Choose argument scheme:
          <select name="scheme" value={this.state.scheme} onChange={this.handleInputChange}>
            <option value="action">Argument for action</option>
            <option value="expert">Argument from expert opinion</option>
            <option value="popular">Argument from popular opinion</option>
          </select>
        </label><br/>
        <ActionScheme clickHandler={this.handleChildClick.bind(this)} {...this.state}/><br/>
      </form>
    )
  }

}

ArgumentForm.propTypes = {
  criticalQuestion: PropTypes.string,
  agree: PropTypes.bool,
  parentId: PropTypes.string
};

export default withRouter(ArgumentForm)
