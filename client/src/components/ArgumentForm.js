import React from 'react'
import {NavLink} from 'react-router-dom'
import axios from 'axios'

import Header from './Header'

class ArgumentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scheme: "action",
      circumstance: "",
      action: "",
      goal: "",
      value: ""
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

  handleSubmit(event) {
    axios.post('http://localhost:3001/argument', {...this.state})
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Header title="Submit an argument" />
        <form onSubmit={this.handleSubmit} className="Form">
          <label>
            Choose argument scheme:
            <select name="scheme" value={this.state.scheme} onChange={this.handleInputChange}>
              <option value="action">Argument for action</option>
              <option value="expert">Argument from expert opinion</option>
              <option value="popular">Argument from popular opinion</option>
            </select>
          </label><br/>
          <label>
            In circumstance, S:
            <input type="text" name="circumstance" value={this.state.circumstance} onChange={this.handleInputChange} />
          </label><br/>
          <label>
            Doing action, A:
            <input type="text" name="action" value={this.state.action} onChange={this.handleInputChange} />
          </label><br/>
          <label>
            Will achieve goal, G:
            <input type="text" name="goal" value={this.state.goal} onChange={this.handleInputChange} />
          </label><br/>
          <label>
            That promote value, V:
            <input type="text" name="value" value={this.state.value} onChange={this.handleInputChange} />
          </label><br/>
          <input type="submit" value="Submit" />
        </form>
        <NavLink to="/">Go back home</NavLink>
      </div>
    );
  }
}

export default ArgumentForm;
