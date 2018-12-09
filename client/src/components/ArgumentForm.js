import React from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';

class ArgumentForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scheme: "action",
      circumstance: "",
      action: "",
      newCircumstance: "",
      goal: "",
      value: "",
      parentId: null,
      redirect: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    console.log(this.props)
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.post('http://localhost:3001/argument', {...this.state})
      .then(() => {
        this.props.history.push('/')
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
        <label>
          In current circumstance R:
          <input type="text" name="circumstance" value={this.state.circumstance} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          We should perform action A:
          <input type="text" name="action" value={this.state.action} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          Which will result in a new circumstance S:
          <input type="text" name="newCircumstance" value={this.state.newCircumstance} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          Which will achieve goal G:
          <input type="text" name="goal" value={this.state.goal} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          That will promote value V:
          <input type="text" name="value" value={this.state.value} onChange={this.handleInputChange} />
        </label><br/>
        <input type="submit" value="Submit" />
      </form>
    )
  }

}

ArgumentForm.propTypes = {
  criticalQuestion: PropTypes.string,
  agree: PropTypes.bool
};

export default withRouter(ArgumentForm)
