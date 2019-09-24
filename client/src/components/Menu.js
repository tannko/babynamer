import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle } from 'mdbreact';
import { MDBCardText, MDBCol, MDBRow, MDBContainer, MDBJumbotron } from 'mdbreact';
import { getUserName, logout } from '../utils/utils';
import Navbar from './Navbar';

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

                  <MDBCol>
                    <MDBCard>
                      <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" waves />
                      <MDBCardBody>
                        <MDBCardTitle>Shared With Me</MDBCardTitle>
                        <MDBCardText>Check invitations and help your partner with her shortlist rating</MDBCardText>
                        <MDBBtn onClick={this.handleCheckClick}>Check</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>

                  <MDBCol>
                    <MDBCard>
                      <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" waves />
                      <MDBCardBody>
                        <MDBCardTitle>New List</MDBCardTitle>
                        <MDBCardText>Start name picking to find the best name for your baby! </MDBCardText>
                        <MDBBtn onClick={this.handleStartClick}>Start</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>

                  <MDBCol>
                    <MDBCard>
                      <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" waves />
                      <MDBCardBody>
                        <MDBCardTitle>My Shortlists</MDBCardTitle>
                        <MDBCardText>View, edit and share your shortlists with best names.</MDBCardText>
                        <MDBBtn onClick={this.handleViewClick}>View</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </div>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

    );
  }
}

export default Menu;
