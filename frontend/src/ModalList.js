import React from 'react';
import axios from 'axios';
import { MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import { MDBBtn, MDBRow, MDBIcon, MDBCardHeader, MDBBadge } from 'mdbreact';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle } from 'mdbreact';
import ShortList from './ShortList';
import ShortlistBody from './ShortlistBody';
import ShareModal from './ShareModal';
import RenameModal from './RenameModal';
import RemoveModal from './RemoveModal';
import DropdownMenu from './DropdownMenu';
import UnshareModal from './UnshareModal';

class ModalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      shareModal: false,
      renameModal: false,
      removeModal: false,
      initialList: [],
      sharedWithUser: null
    }
    this.toggle = this.toggle.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleRenameClick = this.handleRenameClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleUnshareClick = this.handleUnshareClick.bind(this);
    this.shareList = this.shareList.bind(this);
    this.unshare = this.unshare.bind(this);
  }

  componentDidMount() {
    this.setState({ initialList: JSON.parse(JSON.stringify(this.props.shortlist.list)) });
    // TO DO
    if (this.props.shortlist.sharedWith != null) {
      const sharedId = this.props.shortlist.sharedWith.user;
      axios.get('http://localhost:3003/api/user/' + sharedId)
        .then( response => {
          this.setState({ sharedWithUser: response.data });
        })
        .catch( error => {

        });
    }
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
      _id: this.props.shortlist._id,
      name: this.props.shortlist.name,
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

  handleUnshareClick() {
    this.setState({
      unshareModal: !this.state.unshareModal
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

  unshare() {
    const params = {
      id: this.props.shortlist._id
    };
    axios.post('http://localhost:3003/api/unshare', params)
      .then( response => {

      })
      .catch( error => {

      });
  }

  render() {
    const shortlist = this.props.shortlist;
    const isShared = shortlist.sharedWith == null ? false : true;
    const sharedWithName = this.state.sharedWithUser == null ? "" : this.state.sharedWithUser.name;
    const sharedMessage = isShared ? <div className="mr-auto">{ "You shared this list with " + sharedWithName }</div> : "";
    const upperDiv = !this.props.shared ?
            <div className="d-flex mb-3">
              { sharedMessage }
              <div className="ml-auto">
                <DropdownMenu share={ isShared ? this.handleUnshareClick : this.handleShareClick }
                    rename={this.handleRenameClick}
                    remove={this.handleRemoveClick}
                    isShared={isShared} />
                </div></div> :
              <div></div>;

    return (
      <MDBContainer>

        <MDBModal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.toggle}>{shortlist.name}</MDBModalHeader>
          <MDBModalBody>
            {upperDiv}
            <ShortlistBody list={shortlist.list} updateRating={this.updateRating} shared={this.props.shared}></ShortlistBody>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSaveClick}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
        <ShareModal toggle={this.handleShareClick} modal={this.state.shareModal} share={this.shareList} />
        <RenameModal toggle={this.handleRenameClick} modal={this.state.renameModal} />
        <RemoveModal toggle={this.handleRemoveClick} modal={this.state.removeModal} listname={shortlist.name} />
        <UnshareModal toggle={this.handleUnshareClick}
                      modal={this.state.unshareModal}
                      sharedWithUser={this.state.sharedWithUser}
                      unshare={this.unshare}/>

        <a href="#" onClick={this.toggle}>
        <MDBCard className="mt-3">

          { isShared &&
          <MDBCardHeader>

            <div className="d-flex justify-content-end">

              <MDBBadge color="default">
                <MDBIcon icon="envelope-open-text" size="2x" />
              </MDBBadge>

              <MDBBadge color="warning">
                <MDBIcon icon="share-alt" size="2x" />
              </MDBBadge>
            </div>
        </MDBCardHeader> }

          <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"/>
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
