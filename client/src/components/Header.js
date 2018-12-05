import React from 'react'
import {NavLink} from 'react-router-dom'

const Header = (props) => {
  return (
    <div>
      <span className="Header">
        <h1>{props.title}</h1>
      </span>
      <span className="Submit">
        <NavLink to="/submit">Submit Argument</NavLink>
      </span>
    </div>
  )
}

export default Header
