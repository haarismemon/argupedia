import React from 'react'

class ExpertScheme extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      source: "",
      domain: "",
      assertion: ""
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
          There is a source E:
          <input type="text" name="source" value={this.state.source} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          Who is an expert in subject domain D:
          <input type="text" name="domain" value={this.state.domain} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          The source makes the assestion A that:
          <input type="text" name="assertion" value={this.state.assertion} onChange={this.handleInputChange} />
        </label><br/>
        <input type="submit" value="Submit" onClick={this.handleClick.bind(this)}/>
      </div>
    )
  }
}

export default ExpertScheme
