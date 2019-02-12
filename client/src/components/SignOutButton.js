import React from 'react'
import { NavItem} from 'react-bootstrap'

import { withFirebase } from './Firebase'

const SignOutButton = ({ firebase }) => (
    <NavItem onClick={firebase.doSignOut}>
        Sign Out
    </NavItem>
)

export default withFirebase(SignOutButton)