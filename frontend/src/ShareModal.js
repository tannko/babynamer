import React from 'react';
import axios from 'axios';
import { MDBContainer, MDBInput, MDBBtn } from 'mdbreact';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };
    this.handleInput = this.handleInput.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  handleInput(e) {
    this.setState({ email: e.target.value });
  }

  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    if (this.state.email.trim() !== "") {
      this.props.share(this.state.email);
    }
  }

  render() {

    return(
      <form
        className="needs-validation"
        onSubmit={this.submitHandler}
        noValidate>
      <MDBContainer>
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.props.toggle}>Share with your partner</MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              name="email"
              label="Enter your partner's email"
              onInput={this.handleInput}
              required
              pattern="\S+">
              <div className="invalid-feedback">
                Please enter email
              </div>
            </MDBInput>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.props.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" type="submit">Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
      </form>
    );
  }
}

export default ShareModal;
