import React from 'react'
import {Link} from 'react-router-dom'

import Header from '../Header'
import Argument from '../Argument'

class ArgumentDetails extends React.Component {
  state = {
    parentArgument: {}
  }

  render() {
    return (
      <div>
        <Header title="Argument" />
        <Argument parentId={this.props.match.params.id}/>
        <Link to="/">Go back home</Link>
      </div>
    );
  }
}

export default ArgumentDetails
