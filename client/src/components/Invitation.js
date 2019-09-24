import React from 'react';
import { MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';


function Invitation(props) {
    return (
      <MDBCol>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>{props.list.name}</MDBCardTitle>
            <MDBCardText>User {props.list.owner.name} wants to share with you this list</MDBCardText>
            <MDBBtn color="secondary" onClick={props.decline}>Decline</MDBBtn>
            <MDBBtn color="primary" onClick={props.accept}>Accept</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
}

export default Invitation;
