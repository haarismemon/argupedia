import React from 'react'

class ActionScheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      circumstance: "",
      action: "",
      newCircumstance: "",
      goal: "",
      value: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleClick() {
    this.props.clickHandler(this.state)
  }

  render() {
    return (
      <div>
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
        <input type="submit" value="Submit" onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }
}

export default ActionScheme
