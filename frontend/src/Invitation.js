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
    this.props.decline(this.props.list._id);
    /*const user = getUser();
    axios.post('http://localhost:3003/api/unshare', { id: this.props.list._id })
      .then( response => {
        // update state to re-render component
        this.props.rerender();
      })
      .catch( error => {

      });
      */
  }

  handleAcceptClick() {
    this.props.accept(this.props.list._id);
    /*const user = getUser();
    const params = {
      id: this.props.list._id,
      user: user._id
    };
    axios.post('http://localhost:3003/api/accept', params)
      .then( response => {
        // update state to re-render component
        this.props.rerender();
      })
      .catch( error => {

      });*/
  }

  render() {
    const list = this.props.list;
    return (
      <MDBCol>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>{list.name}</MDBCardTitle>
            <MDBCardText>User {list.owner.name} wants to share with you this list</MDBCardText>
            <MDBBtn color="secondary" onClick={this.handleDeclineClick}>Decline</MDBBtn>
            <MDBBtn color="primary" onClick={this.handleAcceptClick}>Accept</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }
}

export default Invitation;
