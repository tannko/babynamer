import React from 'react';
import { MDBContainer, MDBInput, MDBBtn } from 'mdbreact';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };
    this.handleInput = this.handleInput.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleInput(e) {
    this.setState({ email: e.target.value });
  }

  handleSaveClick() {
    
  }

  render() {

    return(
      <MDBContainer>
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.props.toggle}>Share with your partner</MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              name="email"
              label="Enter your partner's email"
              onInput={this.handleInput}>
            </MDBInput>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.props.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSaveClick}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default ShareModal;
