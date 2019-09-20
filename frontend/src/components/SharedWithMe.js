import React from 'react';
import axios from 'axios';
import { getUser } from '../utils/utils';
import { MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader, MDBCardImage } from 'mdbreact';
import { MDBCollapseHeader, MDBCollapse, MDBIcon, MDBBadge } from 'mdbreact';
import Invitation from './Invitation';
import ShortlistEditor from './ShortlistEditor';
import Navbar from './Navbar';
import ErrorMessage from './ErrorMessage';
import { socket } from '../utils/socket_api';


class SharedWithMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedLists: [],
      timestamp: 0,
      isInvitationsOpen: false,
      user: getUser(),
      error: ""
    };
    this.handleInvitationsClick = this.handleInvitationsClick.bind(this);
    this.getData = this.getData.bind(this);
    this.accept = this.accept.bind(this);
    this.decline = this.decline.bind(this);
  }

  componentDidMount() {
    this.getData();

    socket.on('minorChange', params => {
      if (getUser()._id == params.userId) {
        this.getData();
      }
    });
  }

  componentWillUnmount() {
    socket.off('minorChange');
  }

  getData() {
    axios.get('http://localhost:3003/api/shared/' + this.state.user._id)
      .then( response => {
        this.setState({ sharedLists: response.data, error: "" });
      })
      .catch( error => {
        this.setState({ error: error.message });
      });
  }

  handleListClick() {
    this.setState({ editListMode: true });
  }

  handleInvitationsClick() {
    this.setState({ isInvitationsOpen: !this.state.isInvitationsOpen });
  }

  accept(listId) {
    const params = {
      id: listId,
      user: this.state.user._id
    };
    axios.post('http://localhost:3003/api/accept', params)
      .then( response => {
        this.getData();
      })
      .catch( error => {
        this.setState({ error: error.message });
      });
  }

  decline(listId) {
    axios.post('http://localhost:3003/api/unshare', { id: listId })
      .then( response => {
        this.getData();
      })
      .catch( error => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const isInvitationsOpen = this.state.isInvitationsOpen;
    const accepted = [];
    const invitations = [];
    this.state.sharedLists.forEach( list => {
      const status = list.status;
      // sharing is pending
      if (status === 1) {
        invitations.push(
          <MDBCol md="4">
            <Invitation list={list} accept={() => this.accept(list._id)} decline={() => this.decline(list._id)} />
          </MDBCol>
        );
      } else if (status === 2) {
        accepted.push(
          <MDBCol md="4">
            <ShortlistEditor shortlist={list} editor={'partner'}/>
          </MDBCol>
        );
      }
    });
    const invitationsQty = invitations.length;
    const badgeQty = <MDBBadge pill color="danger" className="ml-2">{invitationsQty}</MDBBadge>;
    const isError = this.state.error === "" ? false : true;
    return (
      <MDBContainer>
        <Navbar activeItem="shared"/>
        { isError && <div><ErrorMessage message={this.state.error}/></div> }
        <MDBRow>
          <MDBCol>
            <MDBCard>
              <MDBCardHeader onClick={this.handleInvitationsClick}>
                {invitationsQty == 0 ? "" : badgeQty} Invitations <MDBIcon icon={isInvitationsOpen ? "angle-up" : "angle-down"} />
              </MDBCardHeader>
              <MDBCollapse id="invitations" isOpen={this.state.isInvitationsOpen}>
                <MDBCardBody>
                  <div class="card-deck">
                    { invitationsQty == 0 ? <MDBCard className="text-center"><MDBCardBody>You have 0 invitations</MDBCardBody></MDBCard> : invitations }
                  </div>
                </MDBCardBody>
              </MDBCollapse>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <MDBCard>
              <MDBCardHeader>Accepted for sharing</MDBCardHeader>
              <MDBCardBody>
                <div class="card-deck">
                  {accepted}
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

      </MDBContainer>
    );
  }
}

export default SharedWithMe;
