import React, { Component } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBBtn, MDBModalHeader } from 'mdbreact';

class UnshareModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MDBContainer>
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.props.toggle}>Unshare list</MDBModalHeader>
          <MDBModalBody>
            You share your list with {this.props.partner}. Do you really want to unshare it?
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.props.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.props.unshare}>Unshare</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default UnshareModal;
