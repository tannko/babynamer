import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact';

function GenderChooser(props) {
  const welcomeText = 'I wanna find the best name for a';
  return(
    <MDBCard>
      <MDBCardBody className="text-center">
        <MDBCardTitle>{welcomeText}</MDBCardTitle>
        <MDBBtn onClick={() => props.setGender('m')}>BOY</MDBBtn>
        <MDBBtn onClick={() => props.setGender('f')}>GIRL</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
}

export default GenderChooser;
