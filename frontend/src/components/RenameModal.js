import React from 'react';
import { MDBContainer, MDBInput, MDBBtn } from 'mdbreact';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

class RenameModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newname: "" };
    this.handleInput = this.handleInput.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  handleInput(e) {
    this.setState({ newname: e.target.value });
  }

  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    if (this.state.newname.trim() !== "") {
      this.props.rename(this.state.newname);
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
          <MDBModalHeader toggle={this.props.toggle}>Rename list</MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              name="newname"
              label="Enter new name"
              onInput={this.handleInput}
              required
              pattern="\S+">
              <div className="invalid-feedback">
                Please add name
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

export default RenameModal;
