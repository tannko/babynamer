import React from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol } from 'mdbreact';
//import Button from './Button';

class GenderChooser extends React.Component {
  constructor(props) {
    super(props);
    this.boysHandleClick = this.boysHandleClick.bind(this);
    this.girlsHandleClick = this.girlsHandleClick.bind(this);
  }
  boysHandleClick() {
    this.props.onClick('m');
  }
  girlsHandleClick() {
    this.props.onClick('f');
  }
  render() {
    const welcomeText = 'I wanna find the best name for a';
    return (
      <MDBContainer className="w-50">
        <MDBRow className="min-vh-100 align-items-center">
          <MDBCol>
            <MDBCard>
              <MDBCardBody className="text-center">
                <MDBCardTitle>{welcomeText}</MDBCardTitle>
                <MDBBtn onClick={this.boysHandleClick}>BOY</MDBBtn>
                <MDBBtn onClick={this.girlsHandleClick}>GIRL</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default GenderChooser;
