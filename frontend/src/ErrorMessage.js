import React from 'react';
import { MDBCard, MDBCardTitle, MDBCardBody, MDBCardText } from 'mdbreact';

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
  }
  // TO DO
  // add link "more" for long error messages
  render() {
    return(
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle className="text-danger">ERROR</MDBCardTitle>
          <MDBCardText>Here will be error message from props</MDBCardText>
        </MDBCardBody>
      </MDBCard>
    );
  }
}

export default ErrorMessage;
