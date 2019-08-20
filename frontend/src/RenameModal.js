import React from 'react';
import { MDBContainer, MDBInput, MDBBtn } from 'mdbreact';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

class RenameModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newname: "" };
    this.handleInput = this.handleInput.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleInput(e) {
    this.setState({ newname: e.target.value });
  }

  handleSaveClick() {
    // save new name for the list
    this.props.rename(this.state.newname);
  }

  render() {

    return(
      <MDBContainer>
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.props.toggle}>Rename list</MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              name="newname"
              label="Enter new name"
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

export default RenameModal;
