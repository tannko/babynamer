import React from 'react';
import axios from 'axios';
import { MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import { MDBBtn, MDBRow, MDBIcon, MDBCardHeader, MDBBadge } from 'mdbreact';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle } from 'mdbreact';
import { MDBTabContent, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink } from 'mdbreact';
import ShortList from './ShortList';
import ShortlistBody from './ShortlistBody';
import ShareModal from './ShareModal';
import RenameModal from './RenameModal';
import RemoveModal from './RemoveModal';
import DropdownMenu from './DropdownMenu';
import UnshareModal from './UnshareModal';
import { socket } from './socket_api';
import { objectToMap } from './utils';
import CommonRating from './CommonRating';

class ModalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      shareModal: false,
      renameModal: false,
      removeModal: false,
      initialList: new Map(),
      updatedList: new Map(),
      shortlist: {},
      activeItem: "1",
      //sharedWithUser: null,
      isUpdated: false
    }
    this.toggle = this.toggle.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleRenameClick = this.handleRenameClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleUnshareClick = this.handleUnshareClick.bind(this);
    this.share = this.share.bind(this);
    this.unshare = this.unshare.bind(this);
    this.rename = this.rename.bind(this);
    this.remove = this.remove.bind(this);
    this.setUpdateIcon = this.setUpdateIcon.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    // as we get from props only id and name, get full shortlist from server by id
    // and put it list to the state as an initial list

    //const listId = this.props.shortlist._id;
    this.getData();

    socket.on('listIsUpdated', this.setUpdateIcon);
    socket.on('listRemoved', id => {
      if (this.props.shortlist._id === id) {
        this.handleRemoveClick();
        this.toggle();
        this.props.updateAll();
      }
    });
    socket.on('listRenamed', id => {
      if (this.props.shortlist._id == id) {
        this.handleRenameClick();
        this.getData();
      }
    });
  }



  getData() {
    const listId = this.props.shortlist._id;
    axios.get('http://localhost:3003/api/list/' + listId)
      .then( response => {
        const shortlist = response.data;
        this.setState({ shortlist: shortlist });
        let nameslist;
        if (this.props.editor === 'partner') {
          nameslist = objectToMap(shortlist.partner.list);
        } else {
          nameslist = objectToMap(shortlist.owner.list);
        }
        this.setState({ initialList: nameslist, updatedList: nameslist });

      })
      .catch( error => {

      });
  }

  setUpdateIcon(updatedId) {
    if (this.props.shortlist._id == updatedId) {
      this.setState({ isUpdated: true });
    }
  }

  toggle = () => {
    if (this.state.modal) {
      this.updateRating(this.state.initialList);
    } else {
      //this.setState({ isUpdated: false });
    }

    this.setState({
      modal: !this.state.modal
    });
  }

  toggleRating = tab => e => {
    if (this.state.activeItem !== tab) {
      this.setState({ activeItem: tab });
    }
  }

  updateRating(list) {
    this.setState({ updatedList: list });
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
    const params = {
        id: this.state.shortlist._id,
        editor: this.props.editor,
        list: [...this.state.updatedList]
      };
    axios.post('http://localhost:3003/api/updateList', params)
      .then( res => {
        // show modal that list succesfully updated
      })
      .catch( err => {
        // show modal about error
      });
    //}
  }



  share(email) {
    const nameslist = new Map([]);
    this.state.updatedList.forEach((rating, name) => {
      nameslist.set(name, 0);
    });
    const params = {
      id: this.props.shortlist._id,
      email: email,
      list: [...nameslist]
    };
    axios.post('http://localhost:3003/api/share', params)
      .then( response => {
        // close share window
        // update shortlist modal
        this.handleShareClick();
        this.getData(this.props.shortlist._id);
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
        this.handleUnshareClick();
        this.getData(this.props.shortlist._id);
      })
      .catch( error => {
        // TBD
      });
  }

  rename(newname) {
    const params = {
      id: this.props.shortlist._id,
      name: newname
    };
    /*axios.post('http://localhost:3003/api/rename', params)
      .then( response => {
        this.handleRenameClick();
        this.getData(this.props.shortlist._id);
      })
      .catch( error => {
        // TBD
      });
    */
    socket.emit("rename", params);
  }

  remove() {
    const params = {
      id: this.props.shortlist._id
    };
    socket.emit("remove", this.props.shortlist._id);
    /*axios.post('http://localhost:3003/api/remove', params)
      .then( response => {
        this.handleRemoveClick();
        this.toggle();
        this.props.updateAll();
      })
      .catch( error => {
        // TBD
      });*/
    //socket.on("listRemoved", this.onRemoved);
  }

  render() {
    const shortlist = this.state.shortlist;
    const isShared = shortlist.partner == null ? false : true;
    const isUpdated = this.state.isUpdated;
    const partner = shortlist.partner == null ? null : shortlist.partner.name;
    const sharedMessage = isShared ? <div className="mr-auto">{ "You shared this list with " + partner }</div> : "";
    const upperDiv = this.props.editor === 'owner' ?
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
            <MDBNav className="nav-tabs mt-5">
              <MDBNavItem>
                <MDBNavLink to="#" active={this.state.activeItem === "1"} onClick={this.toggleRating("1")} role="tab">
                  My rating
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#"
                            active={this.state.activeItem === "2"}
                            disabled={shortlist.partner === null}
                            onClick={this.toggleRating("2")}
                            role="tab">
                  Common Rating
                </MDBNavLink>
              </MDBNavItem>
            </MDBNav>
            <MDBTabContent activeItem={this.state.activeItem}>
              <MDBTabPane tabId="1" role="tabpanel">
                <ShortlistBody list={this.state.updatedList} updateRating={this.updateRating}></ShortlistBody>
              </MDBTabPane>
              <MDBTabPane tabId="2" role="tabpanel">
                { shortlist.partner !== null && <CommonRating shortlist={this.state.shortlist} /> }
              </MDBTabPane>
            </MDBTabContent>

          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSaveClick}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
        <ShareModal toggle={this.handleShareClick} modal={this.state.shareModal} share={this.share} />
        <RenameModal toggle={this.handleRenameClick} modal={this.state.renameModal} rename={this.rename} />
        <RemoveModal toggle={this.handleRemoveClick}
                     modal={this.state.removeModal}
                     listname={shortlist.name}
                     remove={this.remove}/>
        <UnshareModal toggle={this.handleUnshareClick}
                      modal={this.state.unshareModal}
                      partner={partner}
                      unshare={this.unshare}/>

        <a href="#" onClick={this.toggle}>
        <MDBCard className="mt-3">

          { isShared &&
          <MDBCardHeader>

            <div className="d-flex justify-content-end">
              { isUpdated &&
              <MDBBadge color="default">
                <MDBIcon icon="envelope-open-text" size="2x" />
              </MDBBadge>
              }
              <MDBBadge color="warning">
                <MDBIcon icon="share-alt" size="2x" />
              </MDBBadge>
            </div>
        </MDBCardHeader> }

          <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"/>
            <MDBCardBody>
              <MDBCardTitle>{shortlist.name}</MDBCardTitle>
              <MDBCardText> has { this.state.updatedList.size } names </MDBCardText>
            </MDBCardBody>
        </MDBCard>
        </a>
      </MDBContainer>
    );
  }
}

export default ModalList;
