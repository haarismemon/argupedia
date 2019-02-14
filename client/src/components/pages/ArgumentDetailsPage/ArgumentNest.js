import React from 'react'

import ArgumentView from './ArgumentView'

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
    const rootArgument = this.props.argumentData[this.props.rootId];

    return (
      <div style={this.props.level !== 0 ? {marginLeft: '60px'} : {}}>
        <ArgumentView argument={rootArgument} />
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
