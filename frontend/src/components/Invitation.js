import React from 'react';
import axios from 'axios';
import { getUser } from '../utils/utils';
import { MDBContainer, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader } from 'mdbreact';

class Invitation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const list = this.props.list;
    return (
      <MDBCol>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>{list.name}</MDBCardTitle>
            <MDBCardText>User {list.owner.name} wants to share with you this list</MDBCardText>
            <MDBBtn color="secondary" onClick={this.props.decline}>Decline</MDBBtn>
            <MDBBtn color="primary" onClick={this.props.accept}>Accept</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
}

export default Invitation;
