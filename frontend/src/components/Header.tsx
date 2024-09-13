import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { LoginModal } from './LoginDialog';
import LoginContext from "./LoginContext";
import React from 'react';
import '../style_HomePage.css';

export function Header() {
    const [modalShow, setModalShow] = useState(false);
    const loginContext = useContext(LoginContext);
    const isLoggedIn = loginContext?.isLoggedIn;
    const logout = loginContext?.logout;
    const isAdmin = loginContext?.isAdmin;

    return (
        <Navbar bg="custom" variant="dark" expand="lg" className="custom-navbar"> {/* Hinzugefügt: custom Klasse */}
            <Container fluid>
                <Navbar.Brand className="me-auto">
                    <span className="title">BookAhead</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Item className="mr-2">
                            {!isLoggedIn ?
                                <Button variant="outline-light" href="/loginU" id="login-button">Login</Button>
                                :
                                <Button variant="outline-light" onClick={logout} className="text-dark border-0">Logout</Button>
                            }
                        </Nav.Item>
                        <Nav.Item>
                            {!isLoggedIn &&
                                <Button variant="outline-light" href="/register-selection" id="register-button">Register</Button>
                            }
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <LoginModal show={modalShow} onHide={() => setModalShow(false)} />
        </Navbar>
    );
}

export default Header;
