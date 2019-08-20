import React from 'react';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBContainer } from 'mdbreact';
import { MDBRow, MDBCol, MDBCardFooter, MDBCardText, MDBCardHeader } from 'mdbreact';
import { MDBCardImage } from 'mdbreact';
import { getUser } from './utils';
import ShortList from './ShortList';
import ModalList from './ModalList';
import Navbar from './Navbar';
import { socket } from './socket_api';

class MyLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lists: [] };
    this.getData = this.getData.bind(this);
    //this.updateRating = this.updateRating.bind(this);
  }

  componentDidMount() {
    const user = getUser();
    // change function to get only id and names of lists
    axios.get('http://localhost:3003/api/lists/' + user._id)
      .then( response => {
        this.setState({ lists: response.data });
      })
      .catch( error => {

      });
    socket.on("updateData", this.getData());
  }

  getData() {
    const user = getUser();
    axios.get('http://localhost:3003/api/lists/' + user._id)
      .then( response => {
        this.setState({ lists: response.data });
      })
      .catch( error => {

      });
  }
/*
  updateInfo(owner) {
    const user = getUser();
    if (owner._id == user._id) {
      axios.get('http://localhost:3003/api/lists/' + user._id)
        .then( response => {
          this.setState({ lists: response.data });
        })
        .catch( error => {

        });
    }
  }
*/

  render() {
    const qty = this.state.lists.length;
    const rows = [];
    const btnStyle = {
      'border-radius' : '50%'
    };
    this.state.lists.forEach( list => {
      rows.push(
        <MDBCol md="4">
          <ModalList shortlist={list} editor={'owner'} updateAll={this.getData}/>
        </MDBCol>
      );
    });
    return(
      <MDBContainer className="min-vh-100 align-items-center justify-content-center">
        <Navbar activeItem="lists"/>
        <div className="card-deck">
          {rows}
        </div>
      </MDBContainer>
    );
  }
}

export default MyLists;

/*
<a href="#" onClick={this.handleListClick}>
<MDBCard className="mt-3">
  <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" />
    <MDBCardBody>
      <MDBCardTitle>{list.name}</MDBCardTitle>
      <MDBCardText> timestamp </MDBCardText>
    </MDBCardBody>
</MDBCard>
</a>

*/
