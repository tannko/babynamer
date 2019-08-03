import React from 'react';
import axios from 'axios';
import { getUser } from './utils';
import { MDBContainer, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdbreact';
import { MDBCardFooter, MDBCardHeader, MDBCardImage } from 'mdbreact';
import Invitation from './Invitation';
import ModalList from './ModalList';

class SharedWithMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sharedLists: [],
      timestamp: 0
    };
    this.rerender = this.rerender.bind(this);
    this.updateRating = this.updateRating.bind(this);
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

  updateRating(list) {
    const updatedLists = JSON.parse(JSON.stringify(this.state.sharedLists));
    for (var item of updatedLists) {
      if (item._id === list._id) { // what if we have two lists with the same name??
        updatedLists[updatedLists.indexOf(item)] = list;
        break;
      }
    }
    this.setState({ sharedLists: updatedLists });
  }

  render() {
    const rows = [];
    this.state.sharedLists.forEach( list => {
      const status = list.sharedWith.status;
      // sharing is pending
      if (status === 0) {
        rows.push(
          <Invitation list={list} rerender={this.rerender} />
        );
      } else {
        rows.push(
          <MDBCol>
            <ModalList shortlist={list} updateRating={this.updateRating} shared={true}/>
          </MDBCol>
        );
      }
    });
    return (
      <MDBContainer>
        <div class="card-deck">
          {rows}
        </div>
      </MDBContainer>
    );
  }
}

export default SharedWithMe;
