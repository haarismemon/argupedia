import React from 'react'

import ArgumentView from './ArgumentView'

class ArgumentNest extends React.Component {
  constructor(props) {
    super(props);

    let childrenArguments = [];
    const currentArgument = this.props.argumentData[this.props.currentId];

    currentArgument.children.forEach(childrenId => {
      const childArgument = this.props.argumentData[childrenId];
      childrenArguments.push(childArgument);
    })
    
    this.state = {
      childrenArguments: childrenArguments,
      currentLevelArguments: this.props.currentLevelArguments
    }
  }
  
  render() {
    const {currentId, rootId} = this.props;
    const currentArgument = this.props.argumentData[currentId];

    return (
      <div style={this.props.level !== 0 ? {marginLeft: '60px'} : {}} className={`argument-nest nest-level-${this.props.level}`}>
        <ArgumentView argument={currentArgument} rootId={rootId}/>
        {this.state.childrenArguments.map(argument =>
          <ArgumentNest 
            key={argument._id} 
            level={this.props.level + 1} 
            currentId={argument._id} 
            argumentData={this.props.argumentData}/>
        )}
      </div>
    );
  }
}

export default ArgumentNest
