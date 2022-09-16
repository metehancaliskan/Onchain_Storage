import React, { ComponentLifecycle } from "react";
import { Container, Nav, NavDropdown } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

declare let window: any;

export class MyNavbar extends React.Component<{}, {}> { 

  constructor(props: any) {
    super(props);
    this.navbar = this.navbar.bind(this);
  }

  navbar() {
     if(typeof window.ethereum.selectedAddress === "undefined") {
      return (
        <Navbar className="get-files-container-two" expand="lg">
          <Container className="navbar-color">
            <Navbar.Brand href="#home" className="navbar-color">Chain-Storage</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link className="navbar-color"><Link to="/" className="navbar-color">Home</Link></Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
     } else {
      return (
        <Navbar className="get-files-container-two" expand="lg">
          <Container className="navbar-color">
            <Navbar.Brand href="#home" className="navbar-color">Chain-Storage</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link><Link to="/profile" className="navbar-color">Profile</Link></Nav.Link>
                <Nav.Link><Link to="/profile/buyStorage" className="navbar-color">Buy Storage</Link></Nav.Link>
                <Nav.Link className="navbar-color">Signed As: {window.ethereum.selectedAddress}</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
     }
  }

  render(): React.ReactNode {
    return this.navbar();
  }

}

