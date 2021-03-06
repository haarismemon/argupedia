import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavLink from 'react-bootstrap/NavLink';
import { withRouter } from 'react-router-dom'
import NavItem from 'react-bootstrap/NavItem';
import {compose} from 'recompose'

import * as ROUTES from '../../constants/routes'
import SignOutButton from './SignOutButton'
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

import './Navigation.css';

class NavigationBar extends React.Component {
    render() {
        const currentPath = this.props.history.location.pathname;
        
        return (
            <Navbar bg="dark" variant="dark" expand="sm" onSelect={this.handleClick}>
                <LinkContainer to={ROUTES.HOME}>
                    <Navbar.Brand>Debatably</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <ActiveLink to={ROUTES.HOME} currentPath={currentPath} text="Home"/>
                        <ActiveLink to={ROUTES.SUBMIT_ARGUMENT} currentPath={currentPath} text="Submit Argument"/>
                    </Nav>
                    <AuthUserContext.Consumer>
                        { authUser => 
                            authUser ? <NavigationAuth user={authUser} currentPath={currentPath}/> : <NavigationNonAuth currentPath={currentPath}/>
                        }
                    </AuthUserContext.Consumer>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const NavigationAuth = (props) => (
    <Nav>
        {props.user.displayName &&
        <NavItem>
            <Navbar.Text>Signed in as:&nbsp;</Navbar.Text>
            <ActiveLink to={ROUTES.ACCOUNT} currentPath={props.currentPath} text={props.user.displayName}/>
        </NavItem>
        }
        <SignOutButton />
    </Nav>
)

const NavigationNonAuth = (props) => (
    <Nav>
        <ActiveLink to={ROUTES.SIGN_IN} currentPath={props.currentPath} text="Sign In"/>
        <ActiveLink to={ROUTES.SIGN_UP} currentPath={props.currentPath} text="Sign Up"/>
    </Nav>
)

const ActiveLink = (props) => {
    return (
        <LinkContainer to={props.to} exact>
            <NavLink className={props.currentPath === props.to ? "active-link" : ""}>
                {props.text}
            </NavLink>
        </LinkContainer>
    )
}

export default compose(withRouter, withFirebase)(NavigationBar)