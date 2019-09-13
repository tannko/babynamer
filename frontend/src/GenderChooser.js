import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol } from 'mdbreact';

function GenderChooser(props) {
  const welcomeText = 'I wanna find the best name for a';
  return(
    <MDBCard>
      <MDBCardBody className="text-center">
        <MDBCardTitle>{welcomeText}</MDBCardTitle>
        <MDBBtn onClick={() => props.onClick('m')}>BOY</MDBBtn>
        <MDBBtn onClick={() => props.onClick('f')}>GIRL</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
}

export default GenderChooser;
