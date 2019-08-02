import React from 'react';
import axios from 'axios';
import { MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import { MDBBtn, MDBRow, MDBIcon } from 'mdbreact';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle } from 'mdbreact';
import ShortList from './ShortList';
import ShortlistBody from './ShortlistBody';
import ShareModal from './ShareModal';
import RenameModal from './RenameModal';
import RemoveModal from './RemoveModal';
import DropdownMenu from './DropdownMenu';

class ModalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      shareModal: false,
      renameModal: false,
      removeModal: false,
      initialList: []
    }
    this.toggle = this.toggle.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleRenameClick = this.handleRenameClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.shareList = this.shareList.bind(this);
  }

  componentDidMount() {
    this.setState({ initialList: JSON.parse(JSON.stringify(this.props.shortlist.list)) });
  }

  toggle = () => {
    if (this.state.modal) {
      this.updateRating(this.state.initialList);
    }

    this.setState({
      modal: !this.state.modal
    });
  }

  updateRating(list) {
    const shortlist = {
      name: this.props.shortlist.name,
      //isShared: this.props.shortlist.isShared,
      list: list,
      sharedWith: this.props.shortlist.sharedWith
    };
    this.props.updateRating(shortlist);
  }

  handleShareClick() {
    // show share modal
    this.setState({
      shareModal: !this.state.shareModal
    });
  }

  handleRenameClick() {
    this.setState({
      renameModal: !this.state.renameModal
    });
  }

  handleRemoveClick() {
    this.setState({
      removeModal: !this.state.removeModal
    });
  }

  handleSaveClick() {
    // update shortlist
    axios.post('http://localhost:3003/api/updateList',
      { shortlist: this.props.shortlist })
      .then( res => {
        // show modal that list succesfully updated
      })
      .catch( err => {
        // show modal about error
      });
  }

  shareList(email) {
    const params = {
      id: this.props.shortlist._id,
      email: email
    };
    axios.post('http://localhost:3003/api/share', params)
      .then( response => {

      })
      .catch( error => {

      });

  }

  render() {
    const shortlist = this.props.shortlist;
    return(
      <MDBContainer>

        <MDBModal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.toggle}>{shortlist.name}</MDBModalHeader>
          <MDBModalBody>

            <div className="d-flex justify-content-end">
              <DropdownMenu share={this.handleShareClick}
                            rename={this.handleRenameClick}
                            remove={this.handleRemoveClick} />
            </div>

            <ShortlistBody list={shortlist.list} updateRating={this.updateRating}></ShortlistBody>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSaveClick}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
        <ShareModal toggle={this.handleShareClick} modal={this.state.shareModal} share={this.shareList} />
        <RenameModal toggle={this.handleRenameClick} modal={this.state.renameModal} />
        <RemoveModal toggle={this.handleRemoveClick} modal={this.state.removeModal} listname={shortlist.name} />
        <a href="#" onClick={this.toggle}>
        <MDBCard className="mt-3">
          <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" />
            <MDBCardBody>
              <MDBCardTitle>{shortlist.name}</MDBCardTitle>
              <MDBCardText> timestamp </MDBCardText>
            </MDBCardBody>
        </MDBCard>
        </a>
      </MDBContainer>
    );
  }
}

export default ModalList;
