import React, { Component } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBCollapse, MDBNavbarNav, MDBNavItem, MDBNavLink } from 'mdbreact';
import { MDBDropdown, MDBDropdownToggle, MDBIcon, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';
import { MDBNavbarToggler } from 'mdbreact';
import { logout } from './utils';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleLogoutClick = () => {
    logout();
  }

  render() {
    const homeClass = this.props.activeItem == "home" ? "active" : "";
    const listsClass = this.props.activeItem == "lists" ? "active" : "";
    const sharedClass = this.props.activeItem == "shared" ? "active" : "";
    const newlistClass = this.props.activeItem == "newlist" ? "active" : "";
    return (
      <MDBNavbar color="default-color" dark expand="md">
        <MDBNavbarBrand>
          <strong className="white-text">Babynamer</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse navbar>
          <MDBNavbarNav left>
            <MDBNavItem name="home" className={homeClass} onCLick={this.handleHomeClick}>
              <MDBNavLink to="/">Home</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem name="newlist" className={newlistClass} onClick={this.handleNewClick}>
              <MDBNavLink to="/newlist">New List</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem name="lists" className={listsClass} onCLick={this.handleListsClick}>
              <MDBNavLink to="/lists">My Shorlists</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem name="shared" className={sharedClass} onCLick={this.handleItemClick}>
              <MDBNavLink to="/shared">Shared With Me</MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>
                <MDBDropdownMenu className="drowdown-default">
                  <MDBDropdownItem href="/" onClick={this.handleLogoutClick}>Logout</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

export default Navbar;
