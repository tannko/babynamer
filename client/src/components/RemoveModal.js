import React from 'react';
import { MDBContainer, MDBBtn } from 'mdbreact';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

class RemoveModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleOkClick = this.handleOkClick.bind(this);
  }

  handleOkClick() {
    this.props.remove();
  }

  render() {
    const listname = this.props.listname;
    return(
      <MDBContainer>
        <MDBModal isOpen={this.props.modal} toggle={this.props.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.props.toggle}>Delete list</MDBModalHeader>
          <MDBModalBody>
            Are you sure that you want to delete a list {listname}?
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.props.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleOkClick}>Ok</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default RemoveModal;
