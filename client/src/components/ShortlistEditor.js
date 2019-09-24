import React from 'react';
import axios from 'axios';
import { MDBContainer, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';
import { MDBBtn,  MDBBadge } from 'mdbreact';
import { MDBTabContent, MDBTabPane, MDBNav, MDBNavItem, MDBNavLink } from 'mdbreact';
import ShortlistBody from './ShortlistBody';
import ShareModal from './ShareModal';
import RenameModal from './RenameModal';
import RemoveModal from './RemoveModal';
import UnshareModal from './UnshareModal';
import { socket } from '../utils/socket_api';
import { objectToMap, areMapsEqual } from '../utils/utils';
import CommonRating from './CommonRating';
import ListCard from './ListCard';
import UpperPanel from './UpperPanel';
import { baseUrl } from '../utils/config';

class ShortlistEditor extends React.Component {
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
    this.toggleMain = this.toggleMain.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.toggleMinor = this.toggleMinor.bind(this);
    this.share = this.share.bind(this);
    this.unshare = this.unshare.bind(this);
    this.rename = this.rename.bind(this);
    this.remove = this.remove.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();

    socket.on('minorChange', params => {
      if (this.props.shortlist._id == params.listId) {
        this.toggleMinor(params.modal);
        if (params.modal === 'removeModal') {
          this.toggleMain();
          this.props.updateAll();
        } else {
          this.getData();
        }
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

        if (params.modal != null) {
          this.toggleMinor(params.modal);
        }
      }
    });
  }

  componentWillUnmount() {
    socket.off('minorChange');
    socket.off('ratingUpdated');
    socket.off('flagUpdated');
    socket.off('error');
  }

  getData() {
    const listId = this.props.shortlist._id;
    axios.get(baseUrl + '/api/list/' + listId)//('http://localhost:3003/api/list/' + listId)
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
        this.setState({ error: error.message });
      });
  }

  toggleMain = () => {
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

  toggleMinor(modal) {
    this.setState({
      [modal]: !this.state[modal]
    });
  }

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
      name: newname,
      partnerId: this.state.shortlist.partner == null ? null : this.state.shortlist.partner._id
    };
    socket.emit("rename", params);
  }

  remove() {
    const params = {
      id: this.props.shortlist._id,
      partnerId: this.state.shortlist.partner == null ? null : this.state.shortlist.partner._id
    };
    socket.emit("remove", params);
  }

  render() {
    const shortlist = this.state.shortlist;
    const isShared = shortlist.partner == null ? false : true;
    const isCommonRatingUpdated = this.state.isCommonRatingUpdated;
    const partner = shortlist.partner == null ? null : shortlist.partner.name;

    return (
      <MDBContainer>
        <MDBModal isOpen={this.state.modal} toggle={this.toggleMain} backdrop={false}>
          <MDBModalHeader toggle={this.toggleMain}>{shortlist.name}</MDBModalHeader>
          <MDBModalBody>
            <UpperPanel editor={this.props.editor}
                        partner={shortlist.partner}
                        error={this.state.error}
                        share={() => this.toggleMinor('shareModal')}
                        unshare={() => this.toggleMinor('unshareModal')}
                        rename={() => this.toggleMinor('renameModal')}
                        remove={() => this.toggleMinor('removeModal')} />
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
            <MDBBtn color="secondary" onClick={this.toggleMain}>Cancel</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleSaveClick}>Save</MDBBtn>
          </MDBModalFooter>
        </MDBModal>

        <ShareModal toggle={() => this.toggleMinor('shareModal')} modal={this.state.shareModal} share={this.share} />
        <RenameModal toggle={() => this.toggleMinor('renameModal')} modal={this.state.renameModal} rename={this.rename} />
        <RemoveModal toggle={() => this.toggleMinor('removeModal')}
                     modal={this.state.removeModal}
                     listname={shortlist.name}
                     remove={this.remove}/>
        <UnshareModal toggle={() => this.toggleMinor('unshareModal')}
                      modal={this.state.unshareModal}
                      partner={partner}
                      unshare={this.unshare}/>

        <ListCard toggle={this.toggleMain}
                  isShared={isShared}
                  isCommonRatingUpdated={isCommonRatingUpdated}
                  name={shortlist.name}
                  size={this.state.updatedList.size}/>
      </MDBContainer>
    );
  }
}

export default ShortlistEditor;
