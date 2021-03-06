import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle } from 'mdbreact';
import { MDBCardText, MDBCol, MDBRow, MDBContainer, MDBJumbotron } from 'mdbreact';
import { getUserName, logout } from '../utils/utils';
import Navbar from './Navbar';
import newlistimg from '../images/newlist.jpg';
import mylistsimg from '../images/namelist.jpg';
import sharedimg from '../images/shared.jpg';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleStartClick() {
    this.props.history.push('/newlist');
  }

  handleViewClick() {
    this.props.history.push('/lists');
  }

  handleCheckClick() {
    this.props.history.push('/shared');
  }

  handleLogoutClick() {
    logout();
    this.props.history.push('./');
  }

  render() {
    const username = getUserName();

    return(
      <MDBContainer className="mt-5 text-center">
        <MDBRow>
          <MDBCol>
            <Navbar activeItem="home"/>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <MDBJumbotron>
              <h2 className="h1 display-3">Hello, {username}!</h2>
              <p className="lead">Welcome to BabyNamer! We are here to help you to find the best name for your little one.</p>
                <div className="card-deck">

                    <MDBCard>
                      <MDBCardImage className="img-fluid" src={newlistimg} waves />
                      <MDBCardBody>
                        <MDBCardTitle>New List</MDBCardTitle>
                        <MDBCardText>Start name picking to find the best name for your baby! </MDBCardText>
                        <MDBBtn onClick={this.handleStartClick}>Start</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>

                    <MDBCard>
                      <MDBCardImage className="img-fluid" src={mylistsimg} waves />
                      <MDBCardBody>
                        <MDBCardTitle>My Lists</MDBCardTitle>
                        <MDBCardText>View, edit and share your shortlists with best names.</MDBCardText>
                        <MDBBtn onClick={this.handleViewClick}>View</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>

                    <MDBCard>
                      <MDBCardImage className="img-fluid" src={sharedimg} waves />
                      <MDBCardBody>
                        <MDBCardTitle>Shared</MDBCardTitle>
                        <MDBCardText>Check invitations and help your partner with her shortlist rating</MDBCardText>
                        <MDBBtn onClick={this.handleCheckClick}>Check</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>

                </div>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

    );
  }
}

export default Menu;
