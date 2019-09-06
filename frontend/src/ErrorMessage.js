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
          <MDBCardText>{this.props.message}</MDBCardText>
        </MDBCardBody>
      </MDBCard>
    );
  }
}

export default ErrorMessage;
