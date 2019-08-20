import React from 'react';
import axios from 'axios';
import { getUser } from './utils';
import { MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader, MDBCardImage } from 'mdbreact';
import { MDBCollapseHeader, MDBCollapse, MDBIcon } from 'mdbreact';
import Invitation from './Invitation';
import ModalList from './ModalList';
import Navbar from './Navbar';


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
    //this.updateRating = this.updateRating.bind(this);
  }

  componentDidMount() {
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
    const user = getUser();
    axios.get('http://localhost:3003/api/shared/' + user._id)
      .then( response => {
        this.setState({ sharedLists: response.data });
      })
      .catch( error => {
        // show modal with error message
      });
  }

  handleListClick() {
    this.setState({ editListMode: true });
  }

  handleInvitationsClick() {
    this.setState({ isInvitationsOpen: !this.state.isInvitationsOpen });
  }

/*  updateRating(list) {
    const updatedLists = JSON.parse(JSON.stringify(this.state.sharedLists));
    for (var item of updatedLists) {
      if (item._id === list._id) {
        updatedLists[updatedLists.indexOf(item)] = list;
        break;
      }
    }
    this.setState({ sharedLists: updatedLists });
  }
*/

  render() {
    const isInvitationsOpen = this.state.isInvitationsOpen;
    const accepted = [];
    const invitations = [];
    this.state.sharedLists.forEach( list => {
      const status = list.status;
      // sharing is pending
      if (status === 1) {
        invitations.push(
          <Invitation list={list} rerender={this.rerender} />
        );
      } else if (status === 2) {
        accepted.push(
          <MDBCol md="4">
            <ModalList shortlist={list} editor={'partner'}/>
          </MDBCol>
        );
      }
    });
    return (
      <MDBContainer>
        <Navbar activeItem="shared"/>
        <MDBRow>
          <MDBCol>
            <MDBCard className="mt-3">
              <MDBCardHeader onClick={this.handleInvitationsClick}>
                Invitations <MDBIcon icon={isInvitationsOpen ? "angle-up" : "angle-down"} />
              </MDBCardHeader>
              <MDBCollapse id="invitations" isOpen={this.state.isInvitationsOpen}>
                <MDBCardBody>
                  <div class="card-deck">
                    {invitations}
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
