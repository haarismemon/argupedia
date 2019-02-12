import React from 'react'
import { Nav, Navbar, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

import * as ROUTES from '../constants/routes'
import SignOutButton from './SignOutButton'
import { AuthUserContext } from './Session';

const Navigation = () => {
    return (
        <Navbar bg="light">
            <Navbar.Brand>Debatably</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to={ROUTES.HOME} exact>
                        <NavItem>Home</NavItem>
                    </LinkContainer>
                    <LinkContainer to={ROUTES.SUBMIT_ARGUMENT}>
                        <NavItem>Submit Argument</NavItem>
                    </LinkContainer >
                    <AuthUserContext.Consumer>
                        { authUser =>
                            authUser ? 
                                <SignOutButton /> : 
                                <LinkContainer to={ROUTES.SIGN_IN}>
                                    <NavItem>Sign In</NavItem>
                                </LinkContainer>
                        }
                    </AuthUserContext.Consumer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation