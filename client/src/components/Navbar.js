import React, { Component } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBCollapse, MDBNavbarNav, MDBNavItem, MDBNavLink } from 'mdbreact';
import { MDBDropdown, MDBDropdownToggle, MDBIcon, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';
import { MDBNavbarToggler } from 'mdbreact';
import { getUserName, logout } from '../utils/utils';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
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
        <MDBCollapse id="main" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav left>
            <MDBNavItem name="home" className={homeClass} onClick={this.handleHomeClick}>
              <MDBNavLink to="/">Home</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem name="newlist" className={newlistClass} onClick={this.handleNewClick}>
              <MDBNavLink to="/newlist">New List</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem name="lists" className={listsClass} onClick={this.handleListsClick}>
              <MDBNavLink to="/lists">My Shorlists</MDBNavLink>
            </MDBNavItem>
            <MDBNavItem name="shared" className={sharedClass} onClick={this.handleItemClick}>
              <MDBNavLink to="/shared">Shared With Me</MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user"> { getUserName() }</MDBIcon>
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
