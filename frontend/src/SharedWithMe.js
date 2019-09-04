import React from 'react';
import axios from 'axios';
import { getUser } from './utils';
import { MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader, MDBCardImage } from 'mdbreact';
import { MDBCollapseHeader, MDBCollapse, MDBIcon, MDBBadge } from 'mdbreact';
import Invitation from './Invitation';
import ModalList from './ModalList';
import Navbar from './Navbar';
import { socket } from './socket_api';


class SharedWithMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedLists: [],
      timestamp: 0,
      isInvitationsOpen: false
    };
    this.rerender = this.rerender.bind(this);
    this.handleInvitationsClick = this.handleInvitationsClick.bind(this);
    this.getData = this.getData.bind(this);
    //this.updateRating = this.updateRating.bind(this);
  }

  componentDidMount() {
    this.getData();

    socket.on('listShared', params => {
      if (params.userId === getUser()._id) {
        this.getData();
      }
    });
  }

  componentWillUnmount() {
    socket.off('listShared');
  }

  getData() {
    const user = getUser();
    axios.get('http://localhost:3003/api/shared/' + user._id)
      .then( response => {
        this.setState({ sharedLists: response.data });
      })
      .catch( error => {
        // show modal with error message
      });
  }

  rerender() {
    //change it later with sockets
    this.getData();
  }

  handleListClick() {
    this.setState({ editListMode: true });
  }

  handleInvitationsClick() {
    this.setState({ isInvitationsOpen: !this.state.isInvitationsOpen });
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
            <Invitation list={list} rerender={this.rerender} />
          </MDBCol>
        );
      } else if (status === 2) {
        accepted.push(
          <MDBCol md="4">
            <ModalList shortlist={list} editor={'partner'}/>
          </MDBCol>
        );
      }
    });
    const invitationsQty = invitations.length;
    const badgeQty = <MDBBadge pill color="danger" className="ml-2">{invitationsQty}</MDBBadge>;
    return (
      <MDBContainer>
        <Navbar activeItem="shared"/>
        <MDBRow>
          <MDBCol>
            <MDBCard className="mt-3">
              <MDBCardHeader onClick={this.handleInvitationsClick}>
                {invitationsQty == 0 ? "" : badgeQty} Invitations <MDBIcon icon={isInvitationsOpen ? "angle-up" : "angle-down"} />
              </MDBCardHeader>
              <MDBCollapse id="invitations" isOpen={this.state.isInvitationsOpen}>
                <MDBCardBody>
                  <div class="card-deck">
                    { invitationsQty == 0 ? "You have 0 invitations" : invitations }
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

/*

*/
