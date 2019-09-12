import React from 'react';
import axios from 'axios';
import { MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdbreact';
import { MDBBtn, MDBRow, MDBIcon, MDBCardHeader, MDBBadge } from 'mdbreact';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBDropdownToggle } from 'mdbreact';
import { MDBTabContent, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink, MDBTooltip } from 'mdbreact';
import ShortList from './ShortList';
import ShortlistBody from './ShortlistBody';
import ShareModal from './ShareModal';
import RenameModal from './RenameModal';
import RemoveModal from './RemoveModal';
import UnshareModal from './UnshareModal';
import { socket } from './socket_api';
import { objectToMap, areMapsEqual } from './utils';
import CommonRating from './CommonRating';
import ListCard from './components/ListCard';
import UpperPanel from './components/UpperPanel';

class ModalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      shareModal: false,
      unshareModal: false,
      renameModal: false,
      removeModal: false,
      initialList: new Map(),
      updatedList: new Map(),
      shortlist: {},
      activeItem: "1",
      isCommonRatingUpdated: false,
      error: ""
    }
    this.toggle = this.toggle.bind(this);
    this.updateRating = this.updateRating.bind(this);
    //this.handleShareClick = this.handleShareClick.bind(this);
    //this.handleRenameClick = this.handleRenameClick.bind(this);
    //this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    //this.handleUnshareClick = this.handleUnshareClick.bind(this);
    this.menuClick = this.menuClick.bind(this);
    this.share = this.share.bind(this);
    this.unshare = this.unshare.bind(this);
    this.rename = this.rename.bind(this);
    this.remove = this.remove.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();

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
    socket.on('listShared', params => {
      if (this.props.shortlist._id == params.listId) {
        this.handleShareClick('shareModal');
        this.getData();
      }
    });
    socket.on('listUnshared', params => {
      if (this.props.shortlist._id === params.listId) {
        this.handleUnshareClick();
        this.getData();
      }
    });
    socket.on('ratingUpdated', id => {
      if (this.props.shortlist._id === id) {
        this.getData();
      }
    });
    socket.on('flagUpdated', id => {
      if (this.props.shortlist._id === id) {
        this.getData();
      }
    });
    socket.on('error', params => {
      if (this.props.shortlist._id === params.id) {
        this.setState({ error: params.errorMessage });
      }
    })
  }

  componentWillUnmount() {
    socket.off('listRemoved');
    socket.off('listRenamed');
    socket.off('listShared');
    socket.off('listUnshared');
    socket.off('ratingUpdated');
    socket.off('flagUpdated');
    socket.off('error');
  }

  getData() {
    const listId = this.props.shortlist._id;
    axios.get('http://localhost:3003/api/list/' + listId)
      .then( response => {
        const shortlist = response.data;
        this.setState({ shortlist: shortlist });

        let nameslist = new Map();
        if (this.props.editor === 'partner' && shortlist.partner
              && !areMapsEqual(this.state.initialList, shortlist.partner.list)) {
          nameslist = objectToMap(shortlist.partner.list);
        }
        if (this.props.editor === 'owner'
            && !areMapsEqual(this.state.initialList, shortlist.owner.list)) {
          nameslist = objectToMap(shortlist.owner.list);
        }
        this.setState({ initialList: nameslist, updatedList: nameslist });


        if ((this.props.editor === 'partner' && shortlist.partner && shortlist.owner.isUpdated)
              || (this.props.editor === 'owner' && shortlist.partner && shortlist.partner.isUpdated )){
          this.setState({ isCommonRatingUpdated: true });
        } else {
          this.setState({ isCommonRatingUpdated: false });
        }

        if (this.props.editor === 'partner' && shortlist.partner === null) {
          this.setState({ error: this.props.editor.name + "does not share this list with you anymore" });
        } else {
          this.setState({ error: "" });
        }

      })
      .catch( error => {
        this.setState({ error: error });
      });
  }

  toggle = () => {
    if (this.state.modal) {
      this.updateRating(this.state.initialList);
    }

    this.setState({
      modal: !this.state.modal
    });
  }

  toggleRating = tab => e => {
    if (this.state.activeItem !== tab) {
      this.setState({ activeItem: tab });
    }
    if (this.state.activeItem === "2" && this.state.isCommonRatingUpdated) {
        const params = {
          id: this.props.shortlist._id,
          updateOwner: this.props.editor === 'partner' ? 'owner' : 'partner'
        };
        socket.emit('updateViewed', params);
    }
  }

  updateRating(list) {
    this.setState({ updatedList: list });
  }

  menuClick(modal) {
    this.setState({
      [modal]: !this.state[modal]
    });
  }

/*
  handleShareClick(modal) {
    this.setState({
      //shareModal: !this.state.shareModal
      [modal]: !this.state[modal]
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
*/
  handleSaveClick() {
    const params = {
        id: this.state.shortlist._id,
        editor: this.props.editor,
        list: [...this.state.updatedList]
      };
    socket.emit("update", params);
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
    socket.emit("share", params);
  }

  unshare() {
    const params = {
      id: this.props.shortlist._id,
      partnerId: this.state.shortlist.partner._id
    };
    socket.emit("unshare", params);
  }

  rename(newname) {
    const params = {
      id: this.props.shortlist._id,
      name: newname
    };
    socket.emit("rename", params);
  }

  remove() {
    const params = {
      id: this.props.shortlist._id
    };
    socket.emit("remove", this.props.shortlist._id);
  }

  render() {
    const shortlist = this.state.shortlist;
    const isShared = shortlist.partner === null ? false : true;
    const isCommonRatingUpdated = this.state.isCommonRatingUpdated;
    const partner = shortlist.partner === null ? null : shortlist.partner.name;

    return (
      <MDBContainer>
        <MDBModal isOpen={this.state.modal} toggle={this.toggle} backdrop={false}>
          <MDBModalHeader toggle={this.toggle}>{shortlist.name}</MDBModalHeader>
          <MDBModalBody>
            <UpperPanel editor={this.props.editor}
                        partner={shortlist.partner}
                        error={this.state.error}
                        share={() => this.menuClick('shareModal')}
                        unshare={() => this.menuClick('unshareModal')}
                        rename={() => this.menuClick('renameModal')}
                        remove={() => this.menuClick('removeModal')} />
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
                  Common Rating { isCommonRatingUpdated && <MDBBadge pill color="info">New</MDBBadge> }
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

        <ShareModal toggle={() => this.menuClick('shareModal')} modal={this.state.shareModal} share={this.share} />
        <RenameModal toggle={() => this.menuClick('renameModal')} modal={this.state.renameModal} rename={this.rename} />
        <RemoveModal toggle={() => this.menuClick('removeModal')}
                     modal={this.state.removeModal}
                     listname={shortlist.name}
                     remove={this.remove}/>
        <UnshareModal toggle={() => this.menuClick('unshareModal')}
                      modal={this.state.unshareModal}
                      partner={partner}
                      unshare={this.unshare}/>

        <ListCard toggle={this.toggle}
                  isShared={isShared}
                  isCommonRatingUpdated={isCommonRatingUpdated}
                  name={shortlist.name}
                  size={this.state.updatedList.size}/>
      </MDBContainer>
    );
  }
}

export default ModalList;
