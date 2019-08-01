import React from 'react';
import axios from 'axios';
import { getUser } from './utils';
import { MDBContainer, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader } from 'mdbreact';

class Invitation extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeclineClick = this.handleDeclineClick.bind(this);
    this.handleAcceptClick = this.handleAcceptClick.bind(this);
  }

  handleDeclineClick() {
    const user = getUser();
    axios.post('http://localhost:3003/unshare', this.props.list._id)
      .then( response => {
        // update state to re-render component
        this.props.rerender();
      })
      .catch( error => {

      });
  }

  handleAcceptClick() {
    const user = getUser();
    axios.post('http://localhost:3003/accept', this.props.list._id)
      .then( response => {
        // update state to re-render component
        this.props.rerender();
      })
      .catch( error => {

      });
  }

  render() {
    const list = this.props.list;
    return (
      <MDBCol>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>{list.name}</MDBCardTitle>
            <MDBCardText>User {list.owner.name} wants to share with you this list</MDBCardText>
            <MDBBtn color="secondary" onClick="handleDeclineClick">Decline</MDBBtn>
            <MDBBtn color="primary" onClick="handleAcceptClick">Accept</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
}

export default Invitation;
