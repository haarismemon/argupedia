import React from 'react'

class ExpertScheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      proposition: ""
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
          Proposition A is generally accepted as being true, that gives a reason in favour of A: 
          <input type="text" name="proposition" value={this.state.proposition} onChange={this.handleInputChange} />
        </label><br/>
        <input type="submit" value="Submit" onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }
}

export default ExpertScheme
