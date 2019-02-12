import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavLink from 'react-bootstrap/NavLink';

import * as ROUTES from '../constants/routes'
import SignOutButton from './SignOutButton'
import { AuthUserContext } from './Session';

const Navigation = () => {
    return (
        <Navbar bg="light" expand="sm">
            <LinkContainer to={ROUTES.HOME}>
                <Navbar.Brand>Debatably</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <AuthUserContext.Consumer>
                { authUser => 
                    authUser ? <NavigationAuth /> : <NavigationNonAuth />
                }
                </AuthUserContext.Consumer>
            </Navbar.Collapse>
        </Navbar>
    );
};

const NavigationAuth = () => (
    <Nav className="mr-auto">
        <LinkContainer to={ROUTES.HOME} exact>
            <NavLink>Home</NavLink>
        </LinkContainer>
        <LinkContainer to={ROUTES.SUBMIT_ARGUMENT}>
            <NavLink>Submit Argument</NavLink>
        </LinkContainer>
        <SignOutButton />
    </Nav>
)

const NavigationNonAuth = () => (
    <Nav className="mr-auto">
        <LinkContainer to={ROUTES.HOME} exact>
            <NavLink>Home</NavLink>
        </LinkContainer>
        <LinkContainer to={ROUTES.SUBMIT_ARGUMENT}>
            <NavLink>Submit Argument</NavLink>
        </LinkContainer>
        <LinkContainer to={ROUTES.SIGN_IN}>
            <NavLink>Sign In</NavLink>
        </LinkContainer>
    </Nav>
)

export default Navigation