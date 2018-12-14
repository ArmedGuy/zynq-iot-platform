import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CustomNavbar.css';

export default class CustomNavbar extends Component {
  render () {
    return (
      <div className="sidenav sidebar">
        <div className="sidenav-header">
          <span><i className="fas fa-dice-d20" style={{"margin-right": "5px"}} /> FPGA</span> Dashboard
        </div>
        <Nav>
          <NavItem eventKey={1} componentClass={Link} active={window.location.pathname === '/'} href="/" to="/"><i className="fas fa-chart-line" style={{"margin-right": "-1px"}}></i> <span>Dashboard</span></NavItem>
          <NavItem eventKey={2} componentClass={Link} active={window.location.pathname === '/configure' || window.location.pathname === '/devices'} href="/devices" to="/devices"><i className="fas fa-cog"></i> <span>Devices</span></NavItem>
          <NavItem eventKey={3} componentClass={Link} active={window.location.pathname === '/about'} href="/about" to="/about"><i className="fas fa-info" style={{"margin": "auto 3.5px"}}></i> <span>About / Contact</span></NavItem>
          {/*<NavItem eventKey={4} componentClass={Link} active={window.location.pathname === '/contact'} href="/contact" to="/contact"><i class="fab fa-telegram-plane" style={{"margin-left": "-2px", "margin-right": "2px"}}></i> <span>Contact Us</span></NavItem>*/}
        </Nav>
      </div>
    )
  }
}