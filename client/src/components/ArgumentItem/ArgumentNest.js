import React from 'react'

import Argument from './Argument'

class ArgumentNest extends React.Component {
  constructor(props) {
    super(props);

    let childrenArguments = [];
    const rootArgument = this.props.argumentData[this.props.rootId];

    rootArgument.children.forEach(childrenId => {
      const childArgument = this.props.argumentData[childrenId];
      childrenArguments.push(childArgument);
    })
    
    this.state = {
      childrenArguments: childrenArguments,
      currentLevelArguments: this.props.currentLevelArguments
    }
  }
  
  render() {
    return (
      <div style={this.props.level !== 0 ? {marginLeft: '60px'} : {}}>
        <Argument argumentId={this.props.rootId}/>
        {this.state.childrenArguments.map(argument =>
          <ArgumentNest 
            key={argument._id} 
            level={this.props.level + 1} 
            rootId={argument._id} 
            argumentData={this.props.argumentData}/>
        )}
      </div>
    );
  }
}

export default ArgumentNest
