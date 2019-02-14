import React from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavLink from 'react-bootstrap/NavLink';

import * as ROUTES from '../../constants/routes'
import SignOutButton from './SignOutButton'
import { AuthUserContext } from '../Session';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="sm">
            <LinkContainer to={ROUTES.HOME}>
                <Navbar.Brand>Debatably</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to={ROUTES.HOME} exact>
                        <NavLink>Home</NavLink>
                    </LinkContainer>
                    <LinkContainer to={ROUTES.SUBMIT_ARGUMENT}>
                        <NavLink>Submit Argument</NavLink>
                    </LinkContainer>
                    <AuthUserContext.Consumer>
                        { authUser => 
                            authUser ? <NavigationAuth /> : <NavigationNonAuth />
                        }
                    </AuthUserContext.Consumer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

const NavigationAuth = () => (
    <div className="navbar-right">
        <LinkContainer to={ROUTES.ACCOUNT}>
            <NavLink>Account</NavLink>
        </LinkContainer>
        <SignOutButton />
    </div>
)

const NavigationNonAuth = () => (
    <div className="navbar-right">
        <LinkContainer to={ROUTES.SIGN_IN}>
            <NavLink>Sign In</NavLink>
        </LinkContainer>
        <LinkContainer to={ROUTES.SIGN_UP}>
            <NavLink>Sign Up</NavLink>
        </LinkContainer>
    </div>
)

export default NavigationBar