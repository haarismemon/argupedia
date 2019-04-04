import React from 'react'
import ArgumentView from './ArgumentView'

class ArgumentNest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      childrenArguments: this.getAllChildArguments(),
      currentLevelArguments: this.props.currentLevelArguments
    }
  }
  
  getAllChildArguments() {
    let childrenArguments = [];
    const currentArgument = this.props.argumentData[this.props.currentId];

    currentArgument.children.forEach(childrenId => {
      const childArgument = this.props.argumentData[childrenId];
      childrenArguments.push(childArgument);
    })

    return childrenArguments;
  }

  render() {
    const {currentId, rootId, highlightId} = this.props;
    const currentArgument = this.props.argumentData[currentId];

    return (
      <div style={this.props.level !== 0 ? {marginLeft: '60px'} : {}} className={`argument-nest nest-level-${this.props.level}`}>
        <ArgumentView argument={currentArgument} rootId={rootId} highlightId={highlightId}/>
        
        { this.state.childrenArguments.map(argument =>
            <ArgumentNest 
              key={argument._id} 
              level={this.props.level + 1} 
              currentId={argument._id} 
              argumentData={this.props.argumentData}
              highlightId={highlightId}/>
          )
        }
      </div>
    );
  }
}

export default ArgumentNest
